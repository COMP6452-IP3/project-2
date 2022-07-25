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
contract Licensing {
    struct Artwork {
        address artist;
        string title;
        uint year;
        Permission[] licenses;
    }

    struct Permission {
        address licensee;
        uint royalty;
        bool paid;
    }

    address payable public artist;      // payable allows artist to receive ether

    // A list of registered artworks in the system
    mapping (uint => Artwork) public artworks; // CID -> Artwork

    constructor() {
        artist = payable(msg.sender);   // ensures artist is a payable account
    }

    function addArtwork (uint cid, string memory _title, uint _year) public restricted {
        artworks[cid].artist = msg.sender;
        artworks[cid].title = _title;
        artworks[cid].year = _year;
    }

    function getPermissionsList(uint cid) view public returns (Permission[] memory) {
        return artworks[cid].licenses;
    }  
    

    // called by artist
    function grantPermission (uint cid, address user, uint _royalty) public restricted {
        artworks[cid].licenses.push(Permission(user, _royalty, false));
    }

    
    // called by licensee
    function getArtwork (uint cid) payable public returns (bool) { 
        uint len = artworks[cid].licenses.length;
        for (uint i = 0; i < len; i++) {
            Permission memory _permission = artworks[cid].licenses[i];
            if (msg.sender == _permission.licensee) {
                // the user is someone with permission
                // checks if the royalty is paid or not
                if (_permission.paid == false) {
                    // royalty payments need to be done
                    // the line below calls the fallback function
                    // todo: do we need to verify 
                    (bool success, ) = address(this).call{value: _permission.royalty}("");
                    require(success, "Failed to send Ether");
                    _permission.paid = true;
                }
                // If paid, all good to receive the artwork
                // todo: make call to the off-chain system to return the artwork
                return true;
            }
        }
        // If we're out of this loop without matching with the licensee then they cannot retrieve artwork
        return false;
    }


    // called by artist to withdraw all ETH stored on this contract
    function withdrawRoyalty() restricted public {
        // get total royalties stored on this contract
        uint amount = address(this).balance;

        // send all Ether to owner
        (bool success, ) = artist.call{value: amount}("");
        require(success, "Failed to withdraw Ether");
    }

    fallback () payable external {}      // overwrite fallback function to accept ETH

    /// @notice must be called by the artist
    modifier restricted() {
        require(msg.sender == artist, "Can only be executed by the artist.");
        _;
    }
}