var bookchain = artifacts.require("Bookchain");

module.exports = function(deployer) {
  deployer.deploy(bookchain);
};
