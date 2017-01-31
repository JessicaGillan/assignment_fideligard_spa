fideligard.factory('transactionService',['dateService', function(dateService) {
  var _transactions = [];
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
    trans.cost = stock.Close * quantity; // Store vs. dynamically calculate since it is a ledger

    _transactions.push(trans);

    return _transactions
  }

  var balanceToday = function(){
    var balance = 100000; // starting pot
    for (var i = 0; i < _transactions.length; i++) {
      if(Date.parse(_transactions[i].date) <= _dateInfo.date){
        if(_transactions[i].type === 'buy') balance -= _transactions[i].cost;
        if(_transactions[i].type === 'sell') balance += _transactions[i].cost;
      }
    }

    return balance;
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
    balanceToday: balanceToday
  }
}]);
