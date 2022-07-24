// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/** 
 * @title Permissions
 * @dev Implements fair use permissions for individuals to use the smart contract
 */

 
contract Licensing {

    struct Artwork {
        string title;
        uint year;
        Permissions[] licenses;
    }

    struct Permissions {
        address licensee;
        uint royalty;
        bool paid;
    }

    // A list of registered artworks in the system
    mapping (uint => Artwork) public artworks;  // CID -> Artwork
    mapping (uint => bytes32) public transactions; //CID -> transactionID
    address artist;
    function addArtwork (uint cid, string memory _title, uint _year) public {
        artworks[cid] = Artwork(_title, _year);
    }


    // called by artist
    function grantPermission (uint _cid, address _licensee, uint _royalty, bool _paid) restricted public returns (bytes32) {
        Artwork storage aw = artworks[_cid];
        Permissions memory _transaction = Permissions(_licensee,_royalty,_paid);
        uint currLic = getLicensesCount(_cid);
        aw.licenses.push(Permissions(_licensee,_royalty,_paid));       
        bytes32 transactionID = generateTransactionID(_transaction);
        transactions[_cid] = transactionID;
        return transactionID;
    }

    /** 
     * @dev create a hash for the transaction id.
     * @param _transaction transaction object
     */
    function generateTransactionID(Permissions memory _transaction) public pure returns (bytes32) {
        return keccak256(abi.encode(_transaction.licensee, _transaction.royalty));
    }   

    // called by licensee
    function getArtwork (uint cid) public returns (bool) { 
        artworks[cid].licenses;
    // loop thru and find licence which matches msg.sender
    // check if theyve paid (if not, call pay function & set paid to true)
    // return true (if everything success)
    return false;
    }

// TWO ROYALTY FUNCTIONS yes

    modifier restricted() {
        require(msg.sender == artist, "Can only be executed by the artist.");
        _;
    }


    



}