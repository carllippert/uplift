// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/utils/Strings.sol";
import "./Edu.sol";

error IncorrectFunds();
error NonExistantTask();
error IncompatableStatus();
error InsufficientEDU();
error IncorrectEDU();
error NotEnoughWorkHistory();
error NotWorkingEnough();

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import {CFAv1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/CFAv1Library.sol";

contract Uplift is ERC721 {
    event TaskClaimed(
        uint256 indexed tokenId,
        address indexed contractor,
        address indexed recruiter
    );

    event StreamUpdated(address indexed contractor, int96 flow);

    event TaskUnclaimed(uint256 indexed tokenId);

    event TaskCancelled(uint256 indexed tokenId);

    event TaskClosed(uint256 indexed tokenId);

    uint256 public currentTokenId;

    string constant _name = "Salto";
    string constant _symbol = "SALTO";

    //flow rate is per second. there is an exmaple
    int96 constant SALARY_ONE_FLOW_RATE = 1000;
    int96 constant SALARY_TWO_FLOW_RATE = 2000;

    //Mumbai fDAIx
    ISuperfluidToken FLOW_TOKEN =
        ISuperfluidToken(0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f);

    //superfluid
    using CFAv1Library for CFAv1Library.InitData;

    //initialize cfaV1 variable
    CFAv1Library.InitData public cfaV1;

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
        //short name
        string name;
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
    constructor(address _edu_address, ISuperfluid host) ERC721(_name, _symbol) {
        //link edu nft
        eduToken = EDU(_edu_address);

        //initialize InitData struct, and set equal to cfaV1
        cfaV1 = CFAv1Library.InitData(
            host,
            //here, we are deriving the address of the CFA using the host contract
            IConstantFlowAgreementV1(
                address(
                    host.getAgreementClass(
                        keccak256(
                            "org.superfluid-finance.agreements.ConstantFlowAgreement.v1"
                        )
                    )
                )
            )
        );
    }

    //tokenid -> task struct
    mapping(uint256 => Task) public tasks;

    //employer -> locked funds
    mapping(address => uint256) public escrowedBalances;

    //address -> withdrawable funds
    mapping(address => uint256) public withdrawableBalances;

    //employer -> cancellable funds
    mapping(address => uint256) public cancellableBalances;

    //address -> stream state
    //0 -> no stream
    //1 -> 1000 stream
    //2 -> 2500 stream
    mapping(address => uint256) public incomeStates;

    //address -> timestamps
    mapping(address => uint256[]) public userCloseStamps;

    function mintTask(
        address _employer,
        address _creator,
        uint256 _creatorBounty,
        uint256 _contractorBounty,
        uint256 _recruiterBounty,
        uint256 _deadline,
        uint256 _minBalance,
        uint256 _minEdu,
        string memory _name,
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
            name: _name,
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
        if (balanceOf(_contractor) < task.minBalance) {
            revert UnAuthorized();
        }

        //user must have sufficient education badges
        if (eduToken.balanceOf(_contractor) < task.minEdu) {
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

        //TODO: redo contract with 712 to allow others to call on behalf
        //had trouble with mocking differnt private keys in foundry so dropped to
        //expedite hack
        // if (task.contractor != msg.sender) {
        //     revert UnAuthorized();
        // }

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

        //hand baked transfer
        //Un poco peligroso
        unchecked {
            _balanceOf[task.employer]--;

            _balanceOf[task.contractor]++;
        }

        _ownerOf[_tokenId] = task.contractor;

        //add timestamp to array
        (userCloseStamps[task.contractor]).push(block.timestamp);

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

    //TODO: obviously some risk not handled here related to terminated streams
    //Not worthwhile for hackathon implementation imo
    //TODO: usefull to implement 712 sig in future or allow admin to initiate streams on behalf of users
    //for better web2 feel options in UI.
    function claimSalary(address user) public {
        //user must have sufficient education badges
        uint256 edu_balance = eduToken.balanceOf(user);

        //TODO: add back
        // if (userCloseStamps[user].length <= 10) {
        //     revert NotEnoughWorkHistory();
        // }

        //see that they have done atleast ten tasks in the last month
        // uint256 tenTasksAgoStamp = userCloseStamps[user][
        //     userCloseStamps[user].length - 10
        // ];

        // if (tenTasksAgoStamp < block.timestamp - 30 days) {
        //     revert NotWorkingEnough();
        // }

        if (edu_balance < 4) {
            revert IncorrectEDU();
        }

        if (edu_balance == 4) {
            createSalary(user, SALARY_ONE_FLOW_RATE);
        }
        if (edu_balance == 5) {
            createSalary(user, SALARY_TWO_FLOW_RATE);
        }
    }

    function createSalary(address user, int96 flow) internal {
        if (incomeStates[user] == 0) {
            //update state
            incomeStates[user] = 1;
            //create stream
            cfaV1.createFlow(user, FLOW_TOKEN, flow);
        } else {
            //update state
            incomeStates[user] = 2;
            //update stream
            cfaV1.updateFlow(user, FLOW_TOKEN, flow);
        }

        emit StreamUpdated(user, flow);
    }

    function stopSalary(address user) external {
        if (userCloseStamps[user].length <= 10) {
            revert NotEnoughWorkHistory();
        }
        //see that they have done atleast ten tasks in the last month
        uint256 tenTasksAgoStamp = userCloseStamps[user][
            userCloseStamps[user].length - 10
        ];

        //if not done 10 things in last 30 days.
        if (tenTasksAgoStamp < block.timestamp - 30 days) {
            cfaV1.deleteFlow(address(this), user, FLOW_TOKEN);
        }   

        emit StreamUpdated(user, 0);
    }

    function getTask(uint256 _tokenId) public view returns (Task memory) {
        return tasks[_tokenId];
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
