fideligard.factory('accountService',[ '_', 'transactionService', 'stockService', 'dateService',
function(_, transactionService, stockService, dateService) {
  var _portfolio = {}, _account = {};

  var getAccount = function getAccount(){
    return _account
  }

  var validPurchase = function validPurchase(stock, quantity) {
    return _account.bankRoll >= (parseFloat(stock.Close) * parseInt(quantity))
  }

  var validSale = function validSale(stock, quantity) {
    return _ownsEnoughStock(stock, quantity)
  }

  var placeOrder = function placeOrder(stock, quantity, type) {
    var trans = transactionService.add(stock, quantity, type);
    _addToPortfolio(trans);

    return _portfolio
  }

  var getQuantityOwned = function getQuantityOwned(stock) {
    if(_portfolio[stock.Symbol]){
      return _portfolio[stock.Symbol].quantity
    }
    return 0;
  }

  var balanceToday = function balanceToday(){
    return _account.bankRoll;
  }

  var buildPortfolio = function buildPortfolio() {
    console.log("building Portfolio");
    var transToDate = transactionService.getToCurrent();
    console.log("transToDate", transToDate)

    angular.copy({}, _portfolio);
    angular.copy({ bankRoll: 100000 }, _account);

    for(var date in transToDate){
      for (var i = 0; i < transToDate[date].length; i++) {
        _addToPortfolio(transToDate[date][i]);
      }
    }
    console.log("portfolio", _portfolio, _account)
    return _portfolio;
  }

  // PRIVATE

  var _addToPortfolio = function _addToPortfolio(transaction) {
    var currentStock = stockService.findForDateBySym(transaction.date, transaction.symbol);

    var symKey = transaction.symbol;
    _portfolio[symKey] =  _portfolio[symKey] || {};
    _portfolio[symKey].quantity =  _portfolio[symKey].quantity || 0;
    _portfolio[symKey].costBasis =  _portfolio[symKey].costBasis || 0.00;
    _portfolio[symKey].symbol =  _portfolio[symKey].symbol || symKey;

    if(transaction.type === "buy"){
      _portfolio[symKey].quantity += transaction.quantity;
    } else {
      _portfolio[symKey].quantity -= transaction.quantity;
    }

    _portfolio[symKey].costBasis += transaction.cost;
    _account.bankRoll += transaction.cost;
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
    quantityOf: getQuantityOwned,
    buildPortfolio: buildPortfolio
  }
}]);
