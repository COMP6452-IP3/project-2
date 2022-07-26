// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;


/**
 * @title RetrieveArtwork.sol
 * @dev Handles access and retrieval of artwork from Web3 storage. Includes verification
 */
contract Licensing {
    struct Artwork {
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

    event PermissionGranted(bool success, uint cid);
    event PermissionNotGranted(uint cid);

    constructor() {
        artist = payable(msg.sender);   // ensures artist is a payable account
    }

    function addArtwork (uint cid, string memory _title, uint _year) public restricted {
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
            Permission storage _permission = artworks[cid].licenses[i];
            if (msg.sender == _permission.licensee) {
                // the user is someone with permission
                // checks if the royalty is paid or not
                if (_permission.paid == false) {
                    // royalty payments need to be done
                    require(msg.value == _permission.royalty, "Incorrect royalty amount.");
                    // the line below calls the fallback function
                    (bool success, ) = address(this).call{value: msg.value}("");
                    require(success, "Failed to send Ether");
                    _permission.paid = true;
                    emit PermissionGranted(success, cid);
                }
                // If paid, all good to receive the artwork
                // todo: make call to the off-chain system to return the artwork
                return true;
            }
        }
        // If we're out of this loop without matching with the licensee then they cannot retrieve artwork
        // Potential issue: if licensee sends in ETH royalty payment and function reaches here, then the licensee will lose that ETH
        emit PermissionNotGranted(cid);
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