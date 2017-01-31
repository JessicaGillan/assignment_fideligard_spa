fideligard.controller('TradePanelCtrl', ['$scope', '$stateParams', 'stockService', 'accountService',
function($scope, $stateParams, stockService, accountService){
  $scope.stock = stockService.findById($stateParams.id);
  $scope.account = accountService.get();

  // Set Defaults
  $scope.quantity = 1;
  $scope.type = "buy";

  $scope.checkValid = function(form){
    if(form.$valid) {
      $state.go(state)
    }
  }

  $scope.valid = function(form){
    if($scope.type === 'buy'){
      return accountService.validPurchase($scope.stock, $scope.quantity)
    } else if($scope.type = 'sell') {
      console.log("checking valid sale")
      return accountService.validSale($scope.stock, $scope.quantity)
    }
  };
}]);
