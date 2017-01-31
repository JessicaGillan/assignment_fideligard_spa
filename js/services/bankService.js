fideligard.factory('bankService',[ function() {
  var _account = { balance: 100000.00 }

  var getAccount = function getAccount(){
    return _account
  }

  return {
    account: getAccount
  }
}]);
