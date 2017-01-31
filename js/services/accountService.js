fideligard.factory('accountService',[ '_', 'transactionService',
function(_, transactionService) {
  var _account = {
                   stocksOwned: {} // { symbol: { purchaseDate: quantity } ...}
                 };

  var getAccount = function getAccount(){
    return _account
  }

  var validPurchase = function validPurchase(stock, quantity) {
    return getBalance() >= (parseInt(stock.Close) * parseInt(quantity))
  }

  var validSale = function validSale(stock, quantity) {
    return _ownsEnoughStock(stock, quantity)
  }

  var placeOrder = function placeOrder(stock, quantity, type) {
    if(type === 'buy'){
      _buyStock(stock, quantity);
    } else if(type === 'sell'){
      _sellStock(stock, quantity);
    } else {
      return false;
    }
  }

  var getQuantityOwned = function getQuantityOwned(stock) {
    var qBeforeDate = 0;
    var id = stock.Symbol;

    for(date in _account.stocksOwned[id]){
      if(Date.parse(date) < Date.parse(stock.Date)){
        qBeforeDate += _account.stocksOwned[id][date];
      }
    }

    return qBeforeDate
  }

  var getBalance = function getBalance(){
    return transactionService.balanceToday()
  }

  // PRIVATE

  var _buyStock = function _buyStock(stock, quantity) {
    var id = stock.Symbol;
    _account.stocksOwned[id] = _account.stocksOwned[id] || {};

    if(_account.stocksOwned[id][stock.Date]) {
      _account.stocksOwned[id][stock.Date] += quantity;
    } else {
      _account.stocksOwned[id][stock.Date] = quantity;
    }

    transactionService.add(stock, quantity, 'buy');

    return _account
  }

  var _sellStock = function _sellStock(stock, quantity) {
    var id = stock.Symbol;
    var leftToSell = quantity;

    for(date in _account.stocksOwned[id]){
      if(Date.parse(date) < Date.parse(stock.Date)){
        if(_account.stocksOwned[id][date] > leftToSell){
          _account.stocksOwned[id][date] -= leftToSell;
          leftToSell = 0;
        } else {
          leftToSell -= _account.stocksOwned[id][date];
          delete _account.stocksOwned[id][date];
        }
      }

      if(leftToSell === 0) break;
    }

    transactionService.add(stock, quantity, 'sell');

    return _account
  }

  var _ownsEnoughStock = function _ownsEnoughStock(stock, quantity) {
    return quantity <= getQuantityOwned(stock)
  };

  return {
    get: getAccount,
    balance: getBalance,
    validPurchase: validPurchase,
    validSale: validSale,
    placeOrder: placeOrder,
    quantityOf: getQuantityOwned
  }
}]);
