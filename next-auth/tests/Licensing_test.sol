// SPDX-License-Identifier: UNLICENSED
        
pragma solidity >=0.8.00 <0.9.0;
import "remix_tests.sol";           // This import is automatically injected by Remix
import "remix_accounts.sol";
import "../contracts/Licensing.sol";
import "https://github.com/GNSPS/solidity-bytes-utils/blob/master/contracts/BytesLib.sol";


contract licensingTestSuite is Licensing {

    using BytesLib for bytes;

    // Accounts
    address acc0;
    address acc1;
    address acc2;

    // Set up
    function beforeAll() public {
        acc0 = TestsAccounts.getAccount(0);   
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
    }

    /// Original sender is the artist
    function origArtistTest() public {
       Assert.equal(artist, acc0, "Artist should be acc0");
    }

    /// -------------------- ARTWORKS TEST --------------------
    /// Artist can add artworks - should increase artworks in system
    function addArtworksTest() public {
       addArtwork("1", "Artwork 1", 2001);
       Assert.equal(artworks["1"].title, "Artwork 1", "Title 1 not set properly.");
       Assert.equal(artworks["1"].year, 2001, "Year 1 not set properly.");
       addArtwork("2", "Artwork 2", 2002);
       Assert.equal(artworks["2"].title, "Artwork 2", "Title 2 not set properly.");
       Assert.equal(artworks["2"].year, 2002, "Year 2 not set properly.");
    }


    /// Only artist can add artworks
    /// #sender: account-1
    function addArtworksFailTest() public {
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("addArtwork(string,string,uint256)", "3", "Artwork 3", 2003));
        if (success == false) {
            string memory reason = abi.decode(result.slice(4, result.length - 4), (string));
            Assert.equal(reason, "Can only be executed by the artist.", "Failed with unexpected reason");
        } else {
            Assert.ok(false, "Method Execution Should Fail");
        }
    }


    /// -------------------- PERMISSIONS TEST --------------------
    /// Grant permissions to particular users
    function addPermissionsTest() public {
       grantPermission("1", acc1, 1000);
       grantPermission("1", acc2, 2000);
       grantPermission("2", acc1, 1000);
       Assert.equal(artworks["1"].licenses.length, 2, "Two permissions should be registered.");

       Permission memory _permission1 = artworks["1"].licenses[0];
       Assert.equal(_permission1.licensee, acc1, "Account not set properly.");
       Assert.equal(_permission1.royalty, 1000, "Royalty not set properly.");
       Assert.equal(_permission1.paid, false, "Paid state not set properly.");
    }

    /// Only artists can grant permissions
    /// #sender: account-1
    function addPermissionsFailTest() public {
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("grantPermission(string,address,uint256)", "2", acc1, 10));
        if (success == false) {
            string memory reason = abi.decode(result.slice(4, result.length - 4), (string));
            Assert.equal(reason, "Can only be executed by the artist.", "Failed with unexpected reason");
        } else {
            Assert.ok(false, "Method Execution Should Fail");
        }
    }

    /// -------------------- GET ARTWORKS TEST --------------------
    /// A licensee with a permission to specified artist can get permission when paying correct royalty
    /// #sender: account-1
    /// #value: 1000
    function retrieveArtworksTest() payable public {
        (bool success, bytes memory result)  = address(this).delegatecall(abi.encodeWithSignature("payRoyalty(string)", "1"));
        Assert.ok(success, "Should not throw any errors.");
        bool successGotArtwork = abi.decode(result, (bool));
        Assert.ok(successGotArtwork, "Should have retrieved artwork.");
        Assert.ok(artworks["1"].licenses[0].paid, "Paid state not updated properly.");
    }

    /// A licensee should be able to retrieve the artwork without sending royalty after theyve sent it once
    /// #sender: account-1
    /// #value: 0
    function retrieveArtworksAfterPaymentTest() payable public {
        (bool success, bytes memory result)  = address(this).delegatecall(abi.encodeWithSignature("payRoyalty(string)", "1"));
        Assert.ok(success, "Should not throw any errors.");
        bool successGotArtwork = abi.decode(result, (bool));
        Assert.ok(successGotArtwork, "Should succeed in getting artwork after once paid royalty.");
    }

    /// Not accepted with incorrect royalty amount
    /// #sender: account-2
    /// #value: 1000
    function retrieveArtworksWrongRoyaltyTest() public {
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("payRoyalty(string)", "1"));
        if (success == false) {
            string memory reason = abi.decode(result.slice(4, result.length - 4), (string));
            Assert.equal(reason, "Incorrect royalty amount.", "Failed with unexpected reason");
        } else {
            Assert.ok(false, "Method Execution Should Fail");
        }
    }

    /// Not accepted if caller has not been given permission
    /// #sender: account-2
    /// #value: 1000
    function retrieveArtworksNotPermittedTest() public {
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("payRoyalty(string)", "2"));
        Assert.ok(success, "Should not throw any errors.");
        bool successGotArtwork = abi.decode(result, (bool));
        Assert.ok(!successGotArtwork, "Should fail in getting artwork.");
    }

    /// -------------------- WITHDRAW ROYALTY TEST --------------------
    /// Only artist can withdraw the balance of the SC
    /// #sender: account-1
    function withdrawAsNotArtistFailTest() public {
        (bool success, bytes memory result) = address(this).delegatecall(abi.encodeWithSignature("withdrawRoyalty()"));
        if (success == false) {
            string memory reason = abi.decode(result.slice(4, result.length - 4), (string));
            Assert.equal(reason, "Can only be executed by the artist.", "Failed with unexpected reason");
        } else {
            Assert.ok(false, "Method Execution Should Fail");
        }
    }

    /// The artist can receive the royalty payments
    function withdrawAsArtistTest() public {
        uint initBalance = address(this).balance;
        Assert.equal(initBalance, 1000, "Royalties not paid properly.");
        withdrawRoyalty();

        uint newBalance = address(this).balance;
        Assert.equal(newBalance, 0, "Royalties not withdrawn properly.");
    }


    /// The artist cannot receive the royalty payments again
    function withdrawAgainShouldBeZeroTest() public {
        uint initBalance = address(this).balance;
        withdrawRoyalty();

        uint newBalance = address(this).balance;
        Assert.equal(initBalance - newBalance, 0, "Royalties were withdrawn twice.");
    }

}
