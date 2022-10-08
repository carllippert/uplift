// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "solmate/tokens/ERC721.sol";
import "openzeppelin-contracts/utils/Strings.sol";

error UnAuthorized();
error TokenIsSoulbound();

contract EDU is ERC721 {
    uint256 public currentTokenId;

    string constant _name = "Uplift EDU";
    string constant _symbol = "EDU";

    address internal immutable UPLIFT;

    //initiate the token
    //FLASH_GORDON_OWNS
    constructor() ERC721(_name, _symbol) {
        UPLIFT = msg.sender;
    }

    function mintTo(address recipient) public payable returns (uint256) {
        if (msg.sender != UPLIFT) {
            revert UnAuthorized();
        }
        uint256 newItemId = ++currentTokenId;
        _safeMint(recipient, newItemId);
        return newItemId;
    }

    /// @notice Override token transfers to prevent sending tokens
    function transferFrom(
        address,
        address,
        uint256
    ) public pure override {
        revert TokenIsSoulbound();
    }

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
