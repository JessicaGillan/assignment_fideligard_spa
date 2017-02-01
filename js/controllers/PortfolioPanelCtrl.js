fideligard.controller('PortfolioPanelCtrl', ['$scope', 'accountService',
function($scope, accountService){
  $scope.state = 'index.portfolio'


  $scope.account = accountService.get();
  $scope.portfolio = $scope.account.portfolio
  console.log($scope.portfolio)
}]);
