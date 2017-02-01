fideligard.factory('transactionService',['dateService', function(dateService) {

  var _transDateIndex = {};
  var _id;
  var _dateInfo = dateService.get();

  var add = function(stock, quantity, type){
    var trans = {};
    trans.id = _getNextId();
    trans.type = type;
    trans.date = stock.Date;
    trans.symbol = stock.Symbol;
    trans.price = stock.Close;
    trans.quantity = quantity;
    trans.cost = (type === 'buy' ? -(stock.Close * quantity) : (stock.Close * quantity)); // Store vs. dynamically calculate since it is a ledger

    _transDateIndex[trans.date] ? _transDateIndex[trans.date].push(trans) : _transDateIndex[trans.date] = [trans];

    _id++;

    console.log(JSON.stringify(_transDateIndex));
    return trans
  }

  var getTransactions = function getTransactions() {
    return _transDateIndex
  }

  var getTransactionsToDate = function getTransactionsToDate() {
    var transToDate = {};
    var curr = _dateInfo.startDate;
    var currStr = curr.toISOString().slice(0,10);

    while(curr <= _dateInfo.endDate){
      if(_transDateIndex[currStr]){
        transToDate[currStr] = _transDateIndex[currStr];
      }

      curr = new Date(Date.parse(currStr) + 86400000);
      currStr = curr.toISOString().slice(0,10);
    }

    return transToDate
  }

  // PRIVATE

  var _getNextId = function _getNextId(){
    if(_id){
      return _id + 1
    } else {
      return 0 // TODO: to make this work in production need to 'findMaxId' in _transactions
    }
  }

  return {
    add: add,
    get: getTransactions,
    getToCurrent: getTransactionsToDate
  }
}]);
