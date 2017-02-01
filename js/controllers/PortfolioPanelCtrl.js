fideligard.controller('PortfolioPanelCtrl', ['$scope','$rootScope', 'accountService', 'dateService',
function($scope, $rootScope, accountService, dateService){
  $scope.state = 'index.portfolio'
  $scope.dateInfo = dateService.get();
  $scope.portfolio = accountService.buildPortfolio();

  $rootScope.$watch('dateInfo', function(newValue, oldValue){
    $scope.portfolio = accountService.buildPortfolio();
  });
}]);
