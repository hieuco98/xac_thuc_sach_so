var xhr = new XMLHttpRequest();
  var prcAddress = '0xd6D3f2AD6bbeEcD62E348e077C791eFB8A3b82B1';
  const form = document.querySelector('form');

  // add event listener
  form.addEventListener('submit', e => {
  
      // disable default action
      e.preventDefault();
  
      // collect files
      const files = document.querySelector('[name=file]').files;
      const formData = new FormData();
      formData.append('bookupload', files[0]);
  
      // post form data
      // log response
      xhr.onload = () => {

          console.log(xhr.responseText);
          var result = JSON.parse(xhr.responseText);
          $("#IPFSlink").html(result.linkIPFS);
          $("#Hash").html(result.hash);
      };
  
      // create and send the reqeust
      xhr.open('POST','/uploadbook');
      xhr.send(formData);
  });
  function contractRegister() {
    var prcInstance;
    var bookName = $("#bookName").val();
    var authors = $("#author").val();
    var hashBook = $("#hashBook").val();
    var publisher = $("#publisher").val();
    var authorAddress = $("#authorAddress").val();
    var yearPublish = $("#yearPublish").val();
    var linkIPFS  = $("#linkIPFS").val();
    //var rawMaterials = $("#rawMaterialsA").val();
    var newBook = {
        bookName: bookName,
        authors : authors,
        hashBook: hashBook,
        publisher:publisher,
        authorAddress:authorAddress,
        yearPublish : yearPublish,
        linkIPFS : linkIPFS
    }
    xhr.open('POST','/reqisterBook',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
    {
      console.log(xhr.responseText);
      alert(xhr.responseText);
    }
    xhr.send(JSON.stringify(newBook));
        console.log("Send Successful waiting ")
        $("#bookName").val();
        $("#author").val();
        $("#hashBook").val();
        $("#publisher").val();
        $("#authorAddress").val();
        $("#yearPublish").val();
        $("#linkIPFS").val();
  }
  // function materialRegister() {
  //   var prcInstance;
  //   var materialName = $("#materialNameA").val();
  //   var materialCode = $("#materialCodeA").val();
  //   var newMaterial = {
  //       materialname: materialName,
  //       materialcode: materialCode,
  //   }
  //   xhr.open('POST','/regmaterial',true);
  //   xhr.setRequestHeader('content-type','application/json');
  //   xhr.onload = function()
  //   {
  //     console.log(xhr.responseText);
  //   }
  //   xhr.send(JSON.stringify(newMaterial));
  //       console.log("Send Successful waiting ")
  //       $("#materialNameA").val('');
  //       $("#materialCodeA").val('');
  // }


// All registered products of the platform
function getAllContract() {
let products = [];
  xhr.open('GET','/showContract');
  xhr.send();
 xhr.onload = function()
     {
         //console.log(xhr.responseText);
         products = JSON.parse(xhr.responseText);
         console.log(products);
         showAllRegister(products);
         //console.log(products)
     }
  //return products;
}

// Show all registered products on the page
function showAllRegister(list) {
      console.log(list)
    $("#productListA").html('');
    list.forEach(function(item, index) {
      $("#productListA").append("<tr><td>" + item.id + "</td><td>" + item.hashBook + "</td><td>" + item.bookName + "</td><td>" + item.authors + "</td><td>" + item.publisher + "</td><td>" + item.contract + "</td><td>" + item.yearPublish + "</td></tr>");
    });
  }
  function getPlantformInfo() {
    $("#plantformAddressA").html(prcAddress);
  }
  function addPRCUser() {
    var userAddress = $("#userAddressA").val();
    var newUser =
    {
        useraddress : userAddress
    }
    xhr.open('POST','/createuser',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
    {
      alert(xhr.responseText);
    }
    xhr.send(JSON.stringify(newUser));
        console.log("Waiting ")
      $("#userAddressA").val('');
  }
  function removePRCUser() {
    var userAddress = $("#userAddressA").val();
    var newUser =
    {
        useraddress : userAddress
    }
    xhr.open('POST','/removeuser',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
    {
      alert(xhr.responseText);
    }
    xhr.send(JSON.stringify(newUser));
        console.log("Waiting ")
      $("#userAddressA").val('');
  }
  function checkPRCUser() {
    var userAddress = $("#userAddressA").val();
    var newUser =
    {
        useraddress : userAddress
    }
    xhr.open('POST','/checkuser',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
    {
      alert(xhr.responseText);
    }
    xhr.send(JSON.stringify(newUser));
        console.log("Waiting ")
      $("#userAddressA").val('');
  }
  function checkBook() {
    const files = document.querySelector('[name=checkFile]').files;
    const formData = new FormData();
    formData.append('checkbook', files[0]);

    xhr.open("POST","/checkBook",true);
    
    xhr.onload = function()
    {
     
      let response = JSON.parse(xhr.responseText);
      console.log(response)
      if(response.code === 200)
      {
        let product = JSON.parse(response.bookInfo);
      console.log(product);
      if(product[0]==='')
      {
        alert("Tác phẩm lỗi hoặc không tồn tại");
      }
      // var linkIPFS = `https://ipfs.infura.io/ipfs/${product[1]}`
      // console.log(linkIPFS);
      $("#bookNameB").html(product[0]);
      $("#authorsB").html(product[2]);
      $("#publisherB").html(product[3]);
      $("#yearsB").html(product[5]);
      $("#linksIPFSB").html(product[6]);

      }
      else
      {
        alert(response.status);
      }
    }
    xhr.send(formData);
        console.log("Waiting ")
  }
  function createSpecialBook()
  {
    var bookName = $("#nameBookC").val();
    var idUser = $("#idUserC").val();
    var customer =$("#customerC").val(); 
    var specialBook = {
      bookName: bookName,
      idUser : idUser,
      customer :customer
  }
  xhr.open('POST','/createSpecialBook',true);
  xhr.setRequestHeader('content-type','application/json');
  xhr.onload = function()
  {
    console.log(xhr.responseText);
    $("#specialBookC").html(xhr.responseText);
  }
  xhr.send(JSON.stringify(specialBook));
      console.log("Send Successful waiting ")
      $("#nameBookC").val();
      $("#idUserC").val();
      $("#customerC").val();
  }
  function checkhashSpecialBook()
  {
    var specialHash =  $("#hashBookC").val()
    var specialHash = {
     hashBook : specialHash
  }
  xhr.open('POST','/checkHashSpecialBook',true);
  xhr.setRequestHeader('content-type','application/json');
  xhr.onload = function()
  {
    //console.log(xhr.responseText);
    var result = JSON.parse(xhr.responseText);
    console.log(result.nameBook);
    $("#bookNameC").html(result.nameBook);
    $("#authorC").html(result.author);
    $("#publisherC").html(result.publisher);
    $("#customerNameC").html(result.customer);
  }
  xhr.send(JSON.stringify(specialHash));
  $("#hashBookC").val()
  }
  function checksaleBook()
  {
    var bookname = $("#bookSaleC").val();
    var checkbook ={
      bookName : bookname
    }
    xhr.open('POST','/checkSaleBook',true);
    xhr.setRequestHeader('content-type','application/json');
    xhr.onload = function()
  {
    //console.log(xhr.responseText);
    var number = JSON.parse(xhr.responseText)
    console.log(number);
     $("#numberBookC").html(number.length);

  }
  xhr.send(JSON.stringify(checkbook));
  $("#bookSaleC").val()
}
//   form.addEventListener('submit', e => {
  
//     // disable default action
//     e.preventDefault();

//     // collect files
//     const files = document.querySelector('[name=checkFile]').files;
//     const formData = new FormData();
//     formData.append('checkBook', files[0]);

//     // post form data
//     // log response
//     xhr.onload = () => {

//         console.log(xhr.responseText);
        
//     };

//     // create and send the reqeust
//     xhr.open('POST','/checkBook');
//     xhr.send(formData);
// });
  window.onload = function() {

    // getPlantformInfo();
     getAllContract();
  
    // $("#uploadFile").click(function(e) {
    //     e.preventDefault();
    //     uploadFile()
    //   })
    $("#home_tab").click(function(e) {
      e.preventDefault();
      getPlantformInfo();
      getAllContract();
    })
  
    $("#product_tab").click(function(e) {
      e.preventDefault();
      // getProductInfo();
      // getAllBatch()
    })
  
  
    $("#registerProductBtnA").click(function() {
      contractRegister();
      //getAllContract();
    });
  
    $("#registerMaterialBtnA").click(function() {

      materialRegister();
      getAllRegister();
    });
  
    $("#addBtnA").click(function() {
      addPRCUser();
    });
  
    $("#removeBtnA").click(function() {
      removePRCUser();
    });
  
    $("#checkBtnA").click(function() {
      checkPRCUser();
    });
    // $("#okBtnB").click(function() {
    //   getProductOfCode();
    // });
    $("#checkFileB").click(function(e) {
      e.preventDefault();
      checkBook();
    })
    $("#createHashC").click(function(e) {
      e.preventDefault();
      createSpecialBook();
    })
    $("#checkHashC").click(function(e) {
      e.preventDefault();
      checkhashSpecialBook();
    })
    $("#checksaleC").click(function(e) {
      e.preventDefault();
      checksaleBook();
    })


    }