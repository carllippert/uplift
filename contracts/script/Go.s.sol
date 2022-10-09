// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Task.sol";
import "../src/Edu.sol";

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

contract ContractScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        address FLASH_GORDON = address(
            0x2BfC102290Bc92767B290B60fdfeCa120058ECD0
        );
        address MUMBAI_SUPERFLUID_HOST = address(
            0xEB796bdb90fFA0f28255275e16936D25d3418603
        );

        address GET_A_JOB = address(0x1b4057644dD9E31Ebd16800C934305C674DaC88E);

        ISuperfluid host = ISuperfluid(MUMBAI_SUPERFLUID_HOST);

        EDU edu = new EDU();
        Uplift task = new Uplift(address(edu), host);

        for (uint256 i = 0; i < 10; i++) {
            task.mintTask(
                FLASH_GORDON, //_employer
                FLASH_GORDON, //_creator,
                0, // _creatorBounty,
                0, // _contractorBounty,
                0, // _recruiterBounty,
                block.timestamp + 1 days, // _deadline,
                0, // _minBalance,
                0, // _minEdu,
                "Do Things", // _name,
                "https://derp.com" // _tokenURI
            );
        }
        
        for (uint256 i = 0; i < 5; i++) {
            edu.mintTo(FLASH_GORDON);
        }

        vm.stopBroadcast();
    }
}
