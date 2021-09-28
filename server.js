require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
var fs = require('fs');
const Web3 = require('web3');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('https://ipfs.infura.io:5001');
const { globSource } = ipfsClient;
var bodyParser = require("body-parser");
var formidable = require("formidable");
// const mongoose = require('mongoose'); 
const contract = require('truffle-contract');
const bookchain = require('./build/contracts/Bookchain.json');
var bookchainAddress = '0x92fdd1f5abc56f21480c724c890fb4d0eb7ffec8';
const address = '0x39eB867F6a8C439d765eeb743d8eBb80F9021d31';
const Provider = require('@truffle/hdwallet-provider');
var sha256File = require('sha256-file');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
//var transactionContract=['0xe2029d49fdb768d84a8142ce2fbef4d07d4eebda02da6aff3f1841a5c1cc61dc','0x81304cda79d3ccef5499c2cc36fc3fabf394a8b0b9bce9d55f9c8d36d244b627'];

var defaultGas = 4700000;
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

const BookChain = contract(bookchain);
BookChain.setProvider(web3.currentProvider);  


//console.log("Connection Successfull!");
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.listen(5000,function()
{
    console.log("Server is running in port 5000");
});
app.post('/uploadbook',function(req,res)
{
    var fileAdded;
    var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        fileAdded = await ipfs.add(globSource(files.bookupload.path,{recursive: true }));
        var hash = sha256File(files.bookupload.path);
        //console.log(fileAdded);
var fileHash = fileAdded.cid;
//console.log(fileHash);
res.send(
    {
        linkIPFS  : `https://ipfs.infura.io/ipfs/${fileHash}`,
        hash :hash
    });
    })

})
app.post('/reqisterBook',async function(req,res)
{
    console.log(req.body);
    var BookChainInstance;
    var bookName = req.body.bookName;
    var authors = req.body.authors;
    var hashBook = req.body.hashBook;
    var publisher = req.body.publisher;
    var authorAddress = req.body.authorAddress;
    var linkIPFS = req.body.linkIPFS;
    var yearPublish = req.body.yearPublish.toString();
    var transaction = await web3.eth.sendTransaction({
        from: address,
        to: authorAddress,
        gas: defaultGas
      });
    var transactionHash =transaction.transactionHash ;
      BookChain.at(bookchainAddress).then(function(instance)
      {
        BookChainInstance = instance;
        return BookChainInstance.contractRegister(bookName, hashBook, authors, publisher,authorAddress,transactionHash,yearPublish,linkIPFS,{
            from: address,
            gas: defaultGas
          });
      }).then(async function(txReceipt) {
        console.log(txReceipt);
        res.send("Tao hop dong thanh cong");
});
})
function getTotalProduct()
{
    var BookChainInstance;
    return  BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance = instance;
        return BookChainInstance.getNumberOfBooks.call()
      }).then(function(total) {
        return total;
      });
}
function getRegisterProduct(id)
{
    var BookChainInstance;
    return BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance = instance;
        return BookChainInstance.getBookOfId.call(id).then(function(product) {
          console.log(product);
          return {
            id: id,
            bookName: product[0],
            hashBook: product[1],
            authors: product[2],
            publisher: product[3],
            contract : product[4],
            yearPublish: product[5]
          }
        })
      });
}
app.get('/showContract',async function(req, res)
{
    let products = [];
    let total = await getTotalProduct();
    console.log(total)
    for (let i = 1; i <= total; i++) {
        let product = await getRegisterProduct(i);
        products.push(product);
      }
      console.log(products);
      var datasend = JSON.stringify(products);
      res.send(datasend);

})
app.post('/createuser',function(req,res)
{
    var BookChainInstance;
    var userAddress = req.body.useraddress;
    BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance = instance;
        console.log("Get PRC address Success")
        return BookChainInstance.addUser(userAddress, {
          from: address,
          gas: defaultGas
        });
      }).then(function(txReceipt) {
        console.log(txReceipt);
        res.send("Create User Success")
      });
})
app.post('/removeuser',function(req,res)
{
    var BookChainInstance;
    var userAddress = req.body.useraddress;
    BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance= instance;
        console.log("Get PRC address Success")
        return BookChainInstance.removeUser(userAddress, {
          from: address,
          gas: defaultGas
        });
      }).then(function(txReceipt) {
        console.log(txReceipt);
        res.send("Remove User Success")
      });
})
app.post('/checkuser',function(req,res)
{
    var BookChainInstance;
    var userAddress = req.body.useraddress;
    BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance= instance;
        console.log("Get PRC address Success")
        return BookChainInstance.checkUser.call(userAddress);
      }).then(function(result) {
        console.log(result);
        if(result)
        {
        res.send("Address was created");
        }
        else
        {
            res.send("Checking your account or add account again");
        }
      });
})
app.post('/checkBook',function(req,res)
{
  var BookChainInstance;
  var id;
  // var hashBook = req.body.hashBook;
  //console.log(productCode);
  var form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        var hash = sha256File(files.checkbook.path);
        BookChain.at(bookchainAddress).then(function(instance) {
          BookChainInstance = instance;
          return BookChainInstance.getIdOfCode.call(hash);
        }).then(function(idd) {
          id = idd;
          console.log(id);
          return BookChainInstance.getBookOfId.call(id);
        }).then(function(product) {
          // bacAddress = product[5];
          // console.log(bacAddress);
          res.send(
              {
                  code:200,
                  bookInfo: JSON.stringify(product)
              }
              );
          }).catch(function(error) {
              console.log('Error occurred!', error);
              res.send({
                  code:404,
                  status: "Ban Hash khong dung yeu cau thu lai"
               })
            })
        //console.log(fileAdded);
var fileHash = fileAdded.cid;
//console.log(fileHash);

    })
})
app.post('/createSpecialBook',function(req,res)
{
  var BookChainInstance;
  var sbookName = req.body.bookName;
  var suserID = req.body.idUser;
  var id;
  var hashbook;
  var customerName = req.body.customer;
  BookChain.at(bookchainAddress).then(function(instance)
  {
    BookChainInstance = instance;
    return BookChainInstance.getIdOfName.call(sbookName);
  }).then(function(idd) {
    id = idd;
    console.log(id);
    return BookChainInstance.getBookOfId.call(id);
  }).then(function(product) {
   var hashBook = product[1];
   return BookChainInstance.hashSpecialBook(hashBook,suserID,{
            from: address,
            gas: defaultGas
          });
      }).then(function(hash)
      {
         hashbook = hash;
         console.log(hashbook);
         return BookChainInstance. specialBookPublish(sbookName,hash,suserID,customerName,{
          from: address,
          gas: defaultGas
         });
      }).then(function(txReceipt)
      {
        console.log(txReceipt);
        res.send(hashbook);
      })
  })
  app.post('/checkHashSpecialBook',function(req,res)
  {
    var BookChainInstance;
    var shashBook = req.body.hashBook;
    var id;
    var customername;
    BookChain.at(bookchainAddress).then(function(instance)
  {
    BookChainInstance = instance;
    return BookChainInstance.getIdOfsBook.call(shashBook)
  }).then(function(idd)
  {
    id = idd;
    return BookChainInstance.getSpecialBookOfId.call(id);
  }).then(function(result)
  {
    
     customername =  result[1];
    console.log(customername);
    var bookname = result[0];
    return BookChainInstance.getIdOfName.call(bookname);
  }).then(function(idd) {
    id = idd;
    console.log(id);
    return BookChainInstance.getBookOfId.call(id);
  }).then(function(product) {
    console.log(product);
    res.send(
      {
        nameBook : product[0],
        author : product[2],
        publisher: product[3],
        customer : customername
      }
    );
  })
})
function getTotalhashSpecialBook()
{
    var BookChainInstance;
    return  BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance = instance;
        return BookChainInstance.getNumberOfSaleBooks.call()
      }).then(function(total) {
        return total;
      });
}
function getSaleBook(id)
{
    var BookChainInstance;
    return BookChain.at(bookchainAddress).then(function(instance) {
        BookChainInstance = instance;
        return BookChainInstance.getSpecialBookOfId.call(id).then(function(product) {
          console.log(product);
          return product;
        })
      });
}
app.post('/checkSaleBook',async function(req,res)
{
  //var BookChainInstance;
  var bookName = req.body.bookName;
  let products = [];
    let total = await getTotalhashSpecialBook();
    console.log(total)
    for (let i = 1; i <= total; i++) {
        let product = await getSaleBook(i);
        products.push(product);
      }
      //console.log(products);
      var saleBook =  products.filter(function(product) {
        return product.bookName == bookName;
      });
      console.log(saleBook);
      res.send(saleBook);
})
app.get('/',(req,res)=>res.sendFile(path.resolve(__dirname, './public')));