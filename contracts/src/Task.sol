// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/utils/Strings.sol";
import "./Edu.sol";

error IncorrectFunds();
error NonExistantTask();
error IncompatableStatus();
error InsufficientEDU();

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";

import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

contract Uplift is ERC721 {
    event TaskClaimed(
        uint256 indexed tokenId,
        address indexed contractor,
        address indexed recruiter
    );

    event TaskUnclaimed(uint256 indexed tokenId);

    event TaskCancelled(uint256 indexed tokenId);

    event TaskClosed(uint256 indexed tokenId);

    uint256 public currentTokenId;

    string constant _name = "Uplift";
    string constant _symbol = "LIFT";

    //Token Contract
    EDU eduToken;

    enum Status {
        OPEN,
        PENDING,
        CLOSED
    }

    struct Task {
        //address spending funds to create task
        address employer;
        //app that mints on behalf of user
        address creator;
        //bounty paid to app that creates on behalf of user
        uint256 creatorBounty;
        //bounty paid on completion of task to task completer
        uint256 contractorBounty;
        //bounty paid to address that finds user to complete task
        uint256 recruiterBounty;
        //self explanatory
        uint256 deadline;
        //public metadata
        string tokenURI;
        //task status
        Status status;
        //recruiter
        address recruiter;
        //contractor
        address contractor;
        //who can claim
        uint256 minBalance;
        //what do they know?
        uint256 minEdu;
    }

    //initiate the token
    constructor(address _edu_address) ERC721(_name, _symbol) {
        eduToken = EDU(_edu_address);
    }

    //tokenid -> task struct
    mapping(uint256 => Task) public tasks;

    //employer -> locked funds
    mapping(address => uint256) public escrowedBalances;

    //address -> withdrawable funds
    mapping(address => uint256) public withdrawableBalances;

    //employer -> cancellable funds
    mapping(address => uint256) public cancellableBalances;

    function mintTask(
        address _employer,
        address _creator,
        uint256 _creatorBounty,
        uint256 _contractorBounty,
        uint256 _recruiterBounty,
        uint256 _deadline,
        uint256 _minBalance,
        uint256 _minEdu,
        string calldata _tokenURI
    ) external payable {
        if (
            msg.value != (_creatorBounty + _contractorBounty + _recruiterBounty)
        ) {
            revert IncorrectFunds();
        }

        //Create Task
        tasks[currentTokenId] = Task({
            employer: _employer,
            creator: _creator,
            creatorBounty: _creatorBounty,
            contractorBounty: _contractorBounty,
            recruiterBounty: _recruiterBounty,
            deadline: _deadline,
            tokenURI: _tokenURI,
            status: Status.OPEN,
            contractor: address(0),
            recruiter: address(0),
            minBalance: _minBalance,
            minEdu: _minEdu
        });

        //Update Accounting

        //creator & network gets paid upfront
        withdrawableBalances[_creator] = _creatorBounty;

        //unclaimed bounties live in "cancellable"
        cancellableBalances[_employer] = _contractorBounty + _recruiterBounty;

        _safeMint(_employer, currentTokenId);

        // Counter overflow is incredibly unrealistic.
        unchecked {
            currentTokenId++;
        }
    }

    //TODO: batch mint

    function claimTask(
        uint256 _tokenId,
        address _recruiter,
        address _contractor
    ) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        //status must be OPEN
        if (tasks[_tokenId].status != Status.OPEN) {
            revert IncompatableStatus();
        }

        //TODO: require deadline
        Task memory task = tasks[_tokenId];

        //user must have sufficient balance of previous work
        if (balanceOf(msg.sender) < task.minBalance) {
            revert UnAuthorized();
        }

        //user must have sufficient education badges
        if (eduToken.balanceOf(msg.sender) < task.minEdu) {
            revert InsufficientEDU();
        }

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "cancellable" to "escrowed"
        //remove bounties from cancellable
        cancellableBalances[task.employer] -= totalFee;
        //put bounties in escrow
        escrowedBalances[task.employer] += totalFee;

        //update state
        task.contractor = _contractor;
        task.recruiter = _recruiter;
        task.status = Status.PENDING;

        emit TaskClaimed(_tokenId, _contractor, _recruiter);
    }

    function closeTask(uint256 _tokenId) external {
        //token must exist
        if (_exists(_tokenId) == false) {
            revert NonExistantTask();
        }

        Task memory task = tasks[_tokenId];

        //status must be PENDING
        if (tasks[_tokenId].status != Status.PENDING) {
            revert IncompatableStatus();
        }

        if (task.contractor != msg.sender) {
            revert UnAuthorized();
        }

        //update accounting
        uint256 totalFee = task.contractorBounty + task.recruiterBounty;

        //transfer bounties from "escrowed" to "withdrawable"

        //remove bounties from cancellable
        escrowedBalances[task.employer] -= totalFee;

        //put bounties in withdrawable
        withdrawableBalances[task.contractor] += task.contractorBounty;
        withdrawableBalances[task.recruiter] += task.recruiterBounty;

        //update state
        task.status = Status.CLOSED;

        //Un poco peligroso
        unchecked {
            _balanceOf[task.employer]--;

            _balanceOf[task.contractor]++;
        }

        _ownerOf[_tokenId] = task.contractor;

        emit Transfer(task.employer, task.contractor, _tokenId);

        emit TaskClosed(_tokenId);
    }

    /// @notice Override token transfers to prevent sending tokens
    function transferFrom(
        address,
        address,
        uint256
    ) public pure override {
        revert TokenIsSoulbound();
    }

    //TODO: ipfs if we use it.
    function tokenURI(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return Strings.toString(id);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf[tokenId] != address(0);
    }
}
