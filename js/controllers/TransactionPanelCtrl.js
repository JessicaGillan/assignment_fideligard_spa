fideligard.controller('TransactionPanelCtrl', ['$scope', 'transactionService', 'dateService',
function($scope, transactionService, dateService){
  $scope.state = 'index.transactions';
  $scope.dateInfo = dateService.get();
  $scope.transactions = transactionService.get();
}]);
