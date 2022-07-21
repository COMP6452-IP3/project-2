pragma solidity ^0.8.0;

contract Contacts {
    struct Contact {
        uint256 id;
        string name;
        string phone;
    }

    uint256 public count = 0; // state variable
    mapping(uint256 => Contact) public contacts;

    constructor() {
        createContact("Zafar Saleem", "123123123");
    }

    function createContact(string memory _name, string memory _phone) public {
        count++;
        contacts[count] = Contact(count, _name, _phone);
    }
}
