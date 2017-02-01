fideligard.factory('accountService',[ '_', 'transactionService', 'stockService', 'dateService',
function(_, transactionService, stockService, dateService) {
  var _account = {
                  // TODO: populate this from transactions, out of sync
                   stocksOwned: {}, // { symbol: { purchaseDate: quantity } ...}
                   portfolio: []
                 };
  var _dateInfo = dateService.get();
  var _stocks = stockService.get();
  var _transactions = transactionService.get();

  var getAccount = function getAccount(){
    return _account
  }

  var validPurchase = function validPurchase(stock, quantity) {
    return balanceToday() >= (parseInt(stock.Close) * parseInt(quantity))
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

  var balanceToday = function balanceToday(){
    var balance = 100000; // starting pot

    for (var i = 0; i < _transactions.length; i++) {
      if(Date.parse(_transactions[i].date) <= _dateInfo.date){
        if(_transactions[i].type === 'buy') balance -= _transactions[i].cost;
        if(_transactions[i].type === 'sell') balance += _transactions[i].cost;
      }
    }

    return balance;
  }

  var buildPortfolio = function buildPortfolio(){
    var portData = {}
    for(var symbol in _account.stocksOwned){
      for(var date in _account.stocksOwned[symbol]){
        portData.transaction = _.find(_transactions, function(trans){ return trans.date === date && trans.symbol === symbol;  });
        portData.stock = _.find(_stocks, function(stock){ return Date.parse(stock.Date) === _dateInfo.date && stock.Symmbol === symbol; });
      }
      _account.portfolio.push(portData);
    }
  }

  // PRIVATE

  var _populateStocksOwned = function populateStocksOwned(){
    for (var i = 0; i < _transactions.length; i++) {
      placeOrder(_transactions[i].stock, _transactions[i].quantity, _transactions[i].type)
    }
  }

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
    balance: balanceToday,
    validPurchase: validPurchase,
    validSale: validSale,
    placeOrder: placeOrder,
    quantityOf: getQuantityOwned
  }
}]);
