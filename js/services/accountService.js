fideligard.factory('accountService',[ '_', 'transactionService',
function(_, transactionService) {
  var _account = { balance: 100000.00,
                   stocksOwned: {} // { symbol: { purchaseDate: quantity } ...}
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

  var placeOrder = function placeOrder(stock, quantity) {
    var id = stock.Symbol;
    _account.stocksOwned[id] = _account.stocksOwned[id] || {};

    if(_account.stocksOwned[id][stock.Date]) {
      _account.stocksOwned[id][stock.Date] += quantity;
    } else {
      _account.stocksOwned[id][stock.Date] = quantity;
    }

    transactionService.add(stock, quantity);
    console.log(_account)
    return _account
  }

  var getQuantityOwned = function getQuantityOwned(stock) {
    var qBeforeDate = 0;
    var id = stock.Symbol;

    for(date in _account.stocksOwned[id]){
      console.log(date, stock.Date)
      if(Date.parse(date) < Date.parse(stock.Date)){
        console.log("less than current date!")
        qBeforeDate += _account.stocksOwned[id][date];
      }
    }

    console.log("q found" , qBeforeDate)
    return qBeforeDate
  }

  // PRIVATE

  var _ownsEnoughStock = function _ownsEnoughStock(stock, quantity) {
    return quantity <= getQuantityOwned(stock)
  };

  return {
    get: getAccount,
    validPurchase: validPurchase,
    validSale: validSale,
    placeOrder: placeOrder,
    quantityOf: getQuantityOwned
  }
}]);
