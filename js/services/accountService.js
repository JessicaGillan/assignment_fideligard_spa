fideligard.factory('accountService',[ '_', function(_) {
  var _account = { balance: 100000.00,
                   stocksOwned: {} // { id: { purchaseDate: quantity } ...}
                 };

  var getAccount = function getAccount(){
    return _account
  }

  var validPurchase = function validPurchase(stock, quantity) {
    return _account.balance >= (parseInt(stock.Close) * parseInt(quantity))
  }

  var validSale = function validSale(stock, quantity) {
    return _ownsEnoughStock(stock, quantity)
  }

  // PRIVATE

  var _ownsEnoughStock = function _ownsEnoughStock(stock, quantity) {
    var qBeforeDate = 0;
    var id = String(stock.id);

    for(date in _account.stocksOwned[id]){
      if(Date.parse(date) < Date.parse(stock.Date)){
        qBeforeDate += _account.stocksOwned[id][date];
      }
    }

    return quantity <= qBeforeDate
  };

  return {
    get: getAccount,
    validPurchase: validPurchase,
    validSale: validSale
  }
}]);
