// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/utils/Strings.sol";

error IncorrectFunds();
error NonExistantTask();
error IncompatableStatus();
error UnAuthorized();

contract Task is ERC721 {
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
    }

    //initiate the token
    constructor() ERC721(_name, _symbol) {}

     //tokenid -> task struct
    mapping(uint256 => Task) public tasks;

    //employer -> locked funds
    mapping(address => uint256) public escrowedBalances;

    //address -> withdrawable funds
    mapping(address => uint256) public withdrawableBalances;

    //employer -> cancellable funds
    mapping(address => uint256) public cancellableBalances;
    
    function tokenURI(uint256 id)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return Strings.toString(id);
    }
}
