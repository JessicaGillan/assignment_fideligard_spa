fideligard.controller('TradePanelCtrl', ['$scope', '$stateParams', 'stockService', 'accountService',
function($scope, $stateParams, stockService, accountService){
  $scope.stock = stockService.findById($stateParams.id);
  $scope.quantity = 1;
  $scope.type = "buy";
  $scope.account = accountService.get();

  $scope.checkValid = function(form){
    if(form.$valid) {
      $state.go(state)
    }
  }

  $scope.valid = function(form){
    if($scope.type === 'buy'){
      return accountService.validPurchase($scope.stock, $scope.quantity)
    } else if($scope.type = 'sell') {
      return accountService.validSale($scope.stock, $scope.quantity)
    }
  };
}]);
