pragma solidity ^ 0.4.23;
contract Bookchain {

  // Mapping from user address to boolean type
  mapping(address => bool) isAuthorized;

  // Define struct
  struct book {
    string _bookName;
    string _hashBook;
    string _authors;
    //string _secondPulisher;
    string _publisher;
    string _transaction;
    string _bookStore;
    uint _time;
    //address _secondPulisherAddress;
    string _yearPublish;
  }
  struct specialBook{
    string _sbookName;
    string _sbookUserID;
    string _hashsBook;
    string _customerName;
  }

  mapping(uint => book) _books;
  mapping(uint => specialBook) _specialBooks;

  mapping(string => uint) _productCodeToId;
  mapping(string => uint) _productNametoId;
  mapping(string => uint) _productsCodetoId;

  uint _numberOfBooks;
  uint _numberOfsBooks;

  address _admin;

  mapping(string => string) _productCodeToName;
  //mapping(string => address) _productCodeToBACAddress;

  // As a prerequisite for some functions
  modifier onlyAdmin {
    require(msg.sender == _admin);
    _;
  }

  modifier onlyAuthorized(address addr) {
    require(isAuthorized[addr] == true);
    _;
  }

  // Constructor function
  constructor() public {
    _admin = msg.sender;
    _numberOfBooks = 1;
  }

  // Register product information
  function contractRegister(string bookName, string hashBook, string authors,string publisher, string bookStore,string transaction,string yearPublish) public onlyAdmin {

    // require(bytes(_productCodeToName[productCode]).length == 0);

    // require(bytes(productName).length >= 3 && bytes(productName).length <= 64);
    // require(bytes(productCode).length == 13);
    // require(bytes(rawMaterials).length >= 9);

    
    _productCodeToId[hashBook] = _numberOfBooks;
    _productNametoId[bookName] = _numberOfBooks;
    //_productCodeToBACAddress[productCode] = BACAddress;

    _books[_numberOfBooks]._bookName = bookName;
    _books[_numberOfBooks]._hashBook = hashBook;
    _books[_numberOfBooks]._authors = authors;
    _books[_numberOfBooks]._publisher = publisher;
    _books[_numberOfBooks]._yearPublish = yearPublish;
    _books[_numberOfBooks]._bookStore = bookStore;
     _books[_numberOfBooks]._transaction = transaction;
     _books[_numberOfBooks]._time = now;
     

    _numberOfBooks++;

  }
  function hashSpecialBook(string memory hashBook, string memory suserID) public pure returns(bytes32){
        string memory hbook = (string(abi.encodePacked(hashBook,suserID)));
        return sha256(hbook);
    }
  function specialBookPublish(string sbookName,string shashbook, string suserID,string customerName) public onlyAdmin 
  {
     _productsCodetoId[shashbook] = _numberOfsBooks ;
    _specialBooks[_numberOfsBooks]._sbookName = sbookName;
    _specialBooks[_numberOfsBooks]._hashsBook = shashbook;
    _specialBooks[_numberOfsBooks]._sbookUserID = suserID;
    _specialBooks[_numberOfsBooks]._customerName = customerName;

    _numberOfsBooks++;
  }

  // Register raw material information
//   function materialRegister(string materialName, string materialCode, address BACAddress) public onlyAdmin {

//     require(bytes(_productCodeToName[materialCode]).length == 0);

//     require(bytes(materialName).length >= 3 && bytes(materialName).length <= 64);
//     require(bytes(materialCode).length == 9);

//     _productCodeToName[materialCode] = materialName;
//     _productCodeToId[materialCode] = _numberOfProducts;
//     _productCodeToBACAddress[materialCode] = BACAddress;

//     _products[_numberOfProducts]._productName = materialName;
//     _products[_numberOfProducts]._productCode = materialCode;
//     _products[_numberOfProducts]._rawMaterials = "/";
//     _products[_numberOfProducts]._productOwner = msg.sender;
//     _products[_numberOfProducts]._timestamp = now;
//     _products[_numberOfProducts]._BACAddress = BACAddress;

//     _numberOfProducts++;

//   }

  // Get the number of products
  function getNumberOfBooks() constant public returns(uint numberOfBooks) {
    numberOfBooks = _numberOfBooks - 1;
  }
   function getNumberOfSaleBooks() constant public returns(uint numberOfsBooks) {
    numberOfsBooks = _numberOfsBooks;
  }


  // Get product information by id
  function getBookOfId(uint id) constant public returns(string bookName, string hashBook, string authors, string publisher, string transactionHash, string yearPublish,string bookStore) {

    bookName = _books[id]._bookName;
    hashBook = _books[id]._hashBook;
    authors = _books[id]._authors;
    publisher = _books[id]._publisher;
    yearPublish = _books[id]._yearPublish;
    transactionHash = _books[id]._transaction;
    bookStore = _books[id]._bookStore;
  }
  function getSpecialBookOfId(uint id) constant public returns(string bookName, string customerName,string hashspecialBook) {

    bookName = _specialBooks[id]._sbookName;
    customerName =  _specialBooks[id]._customerName;
    hashspecialBook = _specialBooks[id]._hashsBook;
  }


  function getIdOfCode(string hashBook) constant public returns(uint id) {
    id = _productCodeToId[hashBook];
  }
  function getIdOfName(string nameBook) constant public returns(uint id)
  {
    id = _productNametoId[nameBook];
  }
  function getIdOfsBook(string hashbook) constant public returns(uint id)
  {
    id = _productsCodetoId[hashbook];
  }

//   function getAddressOfCode(string productCode) constant public returns(address addr) {
//     addr = _productCodeToBACAddress[productCode];
//   }

  // Add user to authorization list

  // Destroy the contract
  function deleteContract() public onlyAdmin {
    selfdestruct(_admin);
  }

}