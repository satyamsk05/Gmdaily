// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GMPortal {
    event NewGM(address indexed sender, uint256 timestamp);

    // Frontend sends 0.00001 ETH, so we must be payable
    function gm() external payable {
        emit NewGM(msg.sender, block.timestamp);
    }

    function withdraw() external {
        payable(msg.sender).transfer(address(this).balance);
    }
}
