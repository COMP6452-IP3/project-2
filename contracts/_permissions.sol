// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Permissions
 * @dev Implements fair use permissions for individuals to use the smart contract
 */
contract Permissions {


    struct OwnershipTransactions {
        address NFT; //address of the NFT in the ownership transaction
        address licensee; //address of the licensee
        bytes32 transactionID;
    }


    address public artist;

    mapping (uint => address) public NFTToLicensee;
    mapping (address => uint) LicenseeNFTCount;


    OwnershipTransactions[] transactions;
    


    /** 
     * @dev assign address of the smart contract to the artist
     */
    constructor() {
        artist = msg.sender;

    }

    /** 
     * @dev Give permissions for the licensee to use the artwork. May only be called by the 'artist'.
     * @param _licensee address of licensee
     * @param _NFT address of the NFT artwork
     */
    function givePermissionsToLicensee(address _licensee, address _NFT) public returns (bytes32) {
        require(
            msg.sender == artist,
            "Only artist can give permission."
        );
        
        OwnershipTransactions memory transaction = OwnershipTransactions(_NFT,_licensee,'');
        bytes32 transactionID = generateTransactionID(transaction);
        transaction.transactionID = transactionID;
        transactions.push(transaction);
        uint id = transactions.length - 1;
        NFTToLicensee[id] = _licensee;
        LicenseeNFTCount[_licensee]++;
        
        return transactionID;
    }
    /** 
     * @dev create a hash for the transaction id.
     * @param _transaction transaction object
     */
    function generateTransactionID(OwnershipTransactions memory _transaction) private pure returns (bytes32) {
        return keccak256(abi.encode(_transaction.NFT, _transaction.licensee));
    }

}