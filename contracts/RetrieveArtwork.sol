// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// todo: (ask) could be better to have this smart contract 
// as part of the same smart contract as issuing permissions
// since (A) will have access to the "owner" of the smart
// contract (artist) to handle payments, (B) will be easier
// to check if royalty has been paid (one time payment can
// be tracked with bool). (C) easier to check if the licensee
// which requests to use the artwork has indeed been given
// permission

/**
 * @title RetrieveArtwork.sol
 * @dev Handles access and retrieval of artwork from Web3 storage. Includes verification
 */
contract RetrieveArtwork {

    address payable public artistWallet;
    string private cID;            // todo: may access this cID in a different way
    bool public royaltyPaid = false;  // has the royalty been paid yet?

    constructor() {
        artistWallet = msg.sender;   // artist calls this function
    }

    /** Flow of this smart contract
     *  Licensee wants access to the artwork
     *  - Call this SC with the pID of the permission transaction they have sent in
     *  - todo: function will search through the pIDs on the BC and retrieve matching ones 
     *    - if not found, function fails; no access   (might need for searching: https://docs.etherscan.io/api-endpoints/accounts)
     *  - check that the licencee address matches sender
     *    - if not, function fails; no access
     *  - if matches:
     *    - if royalty has not yet been paid, call for payment to be made
     *    - find the cID of the artwork in web3 and return it to the website
     */
    
    function requestAccess(string memory pID) public authenticateLicensee returns (string memory) {
        // todo: do the search
        if (!royaltyPaid) {
            payRoyaltyFee;
        }
        return cID;     // todo: how to grab cID
    }


    function payRoyaltyFee() public payable {
        artistWallet.transfer(msg.value);
    }

    function withdrawRoyaltyFee() authenticateArtist public {
        
    }

    /// @notice sender must be the licensee on permission ID 
    modifier authenticateLicensee() {
        require(msg.sender == pID.licensee, "Does not match licensee on permissions."); // todo: how to grab pID data
        _;
    }

    /// @notice sender must be the original artist
    modifier authenticateArtist() {
        require(msg.sender == artist, "Does not match licensee on permissions."); // todo: how to grab pID data
        _;
    }
}