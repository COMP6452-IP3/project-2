// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// @title Contract to license a new artwork
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

    address artist = msg.sender;

    // A list of registered artworks in the system
    mapping (uint => Artwork) public artworks; // CID -> Artwork
    
    function addArtwork (uint cid, string memory _title, uint _year) public {
        artworks[cid].artist = msg.sender;
        artworks[cid].title = _title;
        artworks[cid].year = _year;
    }

    function getPermissionsList(uint cid) public returns (Permission[] memory) {
        return artworks[cid].licenses;
    }  
    

    // called by artist
    function grantPermission (uint cid, address user, uint _royalty) public restricted {
        artworks[cid].licenses.push(Permission(user, _royalty, false));
    }

    // called by licensee
    function getArtwork (uint cid) public returns (bool) { 
        uint len = artworks[cid].licenses.length;
        for (uint i = 0; i < len; i++) {
            address _licensee = artworks[cid].licenses[i].licensee;
            bool _paid = artworks[cid].licenses[i].paid;
            if (msg.sender == _licensee) {
                // the user is someone with permission
                // checks if the royalty is paid or not
                if (_paid == true) {
                    // All good to receive the artwork
                    return true;
                } else {
                    // royalty payments need to be done
                    // royaltyPayment(msg.sender, lics[i].royalty);
                    artworks[cid].licenses[i].paid = true;
                    return true;
                }
            }
        }
        // If we're out of this loop without matching with the licensee then they cannot retrieve artwork
        return false;
    }

    modifier restricted() {
        require(msg.sender == artist, "Can only be executed by the artist.");
        _;
    }
}