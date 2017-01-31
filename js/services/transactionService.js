fideligard.factory('transactionService',['dateService', function(dateService) {
  var _transactions = [
    {"id":0,"type":"buy","date":"2014-01-02","symbol":"AAME","price":"3.98","quantity":1,"cost":3.98},
    {"id":1,"type":"buy","date":"2014-01-02","symbol":"AAWW","price":"40.52","quantity":30,"cost":1215.6000000000001},
    {"id":2,"type":"buy","date":"2014-01-02","symbol":"AAPL","price":"553.12999","quantity":1,"cost":553.12999},
    {"id":3,"type":"buy","date":"2014-01-02","symbol":"ABAC","price":"2.13","quantity":1,"cost":2.13},
    {"id":4,"type":"buy","date":"2014-02-06","symbol":"AAL","price":"34.66","quantity":1,"cost":34.66},
    {"id":5,"type":"buy","date":"2014-02-06","symbol":"AAXJ","price":"56.09","quantity":20,"cost":1121.8000000000002},
    {"id":6,"type":"buy","date":"2014-02-06","symbol":"ABAC","price":"1.86","quantity":25,"cost":46.5},
    {"id":7,"type":"buy","date":"2014-03-06","symbol":"AAL","price":"38.810001","quantity":13,"cost":504.530013},
    {"id":8,"type":"buy","date":"2014-03-06","symbol":"AAON","price":"30.689999","quantity":11,"cost":337.589989},
    {"id":9,"type":"sell","date":"2014-03-06","symbol":"AAXJ","price":"58.93","quantity":19,"cost":1119.67},
    {"id":10,"type":"sell","date":"2014-04-03","symbol":"AAL","price":"37.34","quantity":1,"cost":37.340},
    {"id":11,"type":"sell","date":"2014-04-03","symbol":"AAON","price":"27.799996","quantity":5,"cost":138.99998}
  ];
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
    _id++;

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

  var getTransactions = function getTransactions() {
    return _transactions
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
    balanceToday: balanceToday,
    get: getTransactions
  }
}]);
