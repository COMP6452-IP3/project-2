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
        string title;
        uint256 year;
        Permission[] licenses;
    }

    struct Permission {
        address licensee;
        uint256 royalty;
        bool paid;
    }

    address payable public artist; // payable allows artist to receive ether

    // A list of registered artworks in the system
    mapping(string => Artwork) public artworks; // CID -> Artwork

    // Number of artworks registered in the system
    uint256 public count = 0;

    event PermissionGranted(bool success, string cid);
    event PermissionNotGranted(string cid);

    constructor() {
        artist = payable(msg.sender); // ensures artist is a payable account
    }

    /**
     * @notice Allows artist to register an artwork in the system
     * @dev Only the artist can register an artwork
     * @param cid Identification number from web3 storage
     * @param _title Title of the artwork
     * @param _year Year of the artwork
     */
    function addArtwork(
        string memory cid,
        string memory _title,
        uint256 _year
    ) public restricted {
        artworks[cid].title = _title;
        artworks[cid].year = _year;
        count++;
    }

    /**
     * @notice Allows artist to add a new permission to an artwork
     * @dev Only the artist can add a new permission
     * @param cid Identification number from web3 storage
     * @param _licensee Address of the licensee
     * @param _royalty Royalty amount to be paid to the licensee
     */
    function grantPermission(
        string memory cid,
        address _licensee,
        uint256 _royalty
    ) public restricted {
        artworks[cid].licenses.push(Permission(_licensee, _royalty, false));
    }

    /**
     * @notice Get the royalty amount for a given artwork and licensee
     * @param cid Identification number from web3 storage
     * @return royalty Royalty amount to be paid to the licensee
     */
    function getRoyalty(string memory cid)
        public
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < artworks[cid].licenses.length; i++) {
            if (artworks[cid].licenses[i].licensee == msg.sender) {
                return artworks[cid].licenses[i].royalty;
            }
        }
        return 0;
    }

    /**
     * @notice Allows licensee to pay for the artwork
     * @dev Only the licensee can pay for the artwork
     * @param cid Identification number from web3 storage
     * @return true if successful, false if not
     */
    function payRoyalty(string memory cid) public payable returns (bool) {
        uint256 len = artworks[cid].licenses.length;
        for (uint256 i = 0; i < len; i++) {
            Permission storage _permission = artworks[cid].licenses[i];
            if (msg.sender == _permission.licensee) {
                // the user is someone with permission
                // checks if the royalty is paid or not
                if (_permission.paid == false) {
                    // royalty payments need to be done
                    // todo: do we need to verify
                    require(
                        msg.value == _permission.royalty,
                        "Incorrect royalty amount."
                    );
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
    function withdrawRoyalty() public restricted {
        // get total royalties stored on this contract
        uint256 amount = address(this).balance;

        // send all Ether to owner
        (bool success, ) = artist.call{value: amount}("");
        require(success, "Failed to withdraw Ether");
    }

    fallback() external payable {} // overwrite fallback function to accept ETH

    /// @notice must be called by the artist
    modifier restricted() {
        require(msg.sender == artist, "Can only be executed by the artist.");
        _;
    }
}
