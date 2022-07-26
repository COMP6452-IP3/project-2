// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 < 0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "hardhat/console.sol";
import "../contracts/_Permissions.sol";

contract PermissionsTest is Licensing {
    
    bytes32 transactionID;
    bytes32 compareTransactionID;
    address licensee;
    uint royalty;
    bool paid;
    uint cid;
    Artwork aw;
    bytes32 title;
    uint year;

    function beforeAll() public {
        licensee = 0x7595F02B7103FFBE99Fa4Af6Dc3dCf7cB446096B;
        cid = 0; 
        royalty = 69;  
        paid = false;     
        transactionID = grantPermission(cid,licensee,royalty,false);
        compareTransactionID = generateTransactionID(cid, licensee,royalty);
    }

    function checkTransactionID() public {
        console.log("Running permissions test");
        Assert.equal(transactionID, compareTransactionID, "transaction ids at position 0 should be the same");
    }

 

}