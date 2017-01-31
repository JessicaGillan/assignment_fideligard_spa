fideligard.factory('accountService',[ function() {
  var _account = { balance: 100000.00 }

  var getAccount = function getAccount(){
    return _account
  }

  var validPurchase = function validPurchase(stock, quantity) {
    return _account.balance >= (parseInt(stock.Close) * parseInt(quantity))
  }

  var validSale = function validSale(stock, quantity) {
    return _ownsEnoughStock(stock, quantity) && _purchasedBefore(stock.Date)
  }

  // PRIVATE

  var _ownsEnoughStock;
  var _purchasedBefore;

  return {
    get: getAccount,
    validPurchase: validPurchase,
    validSale: validSale
  }
}]);
