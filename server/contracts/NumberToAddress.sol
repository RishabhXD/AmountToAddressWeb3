// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract NumberToAddress {
    event AddNumber(address recipient, uint256 amount);
    //  Total Amount
    uint256 totalAmount;
    // Address where number is stored
    address payable[] totalAccounts;

    // Mapping address to amount in it
    mapping(address => uint256) myAddress;

    // Function to enter amount
    function setAmount(uint256 _amount) public {
        totalAccounts.push(payable(msg.sender));
        myAddress[msg.sender] += _amount;
        emit AddNumber(msg.sender, myAddress[msg.sender]);
    }

    // Function to get total amount
    function getTotalNumber() public view returns (uint256) {
        uint256 amount = 0;
        for (uint256 i = 0; i < totalAccounts.length; i++) {
            amount += myAddress[totalAccounts[i]];
        }
        return amount;
    }

    // Function to get total accounts
    function getTotalAccounts() public view returns (uint256) {
        return totalAccounts.length;
    }
}
