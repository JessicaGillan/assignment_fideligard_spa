fideligard.controller('TransactionPanelCtrl', ['$scope', 'transactionService',
function($scope, transactionService){
  $scope.state = 'index.transactions'
  $scope.transactions = transactionService.get();
}]);
