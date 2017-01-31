fideligard.factory('transactionService',[ function() {
  var _transactions = [];
  var _id;



  var add = function(stock, quantity){
    var trans = {};
    trans.id = _getNextId();
    trans.date = stock.Date;
    trans.symbol = stock.Symbol;
    trans.price = stock.Close;
    trans.quantity = quantity;
    trans.cost = stock.Close * quantity; // Store vs. dynamically calculate since it is a ledger

    _transactions.push(trans);

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
    add: add
  }
}]);
