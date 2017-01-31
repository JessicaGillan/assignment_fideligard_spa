fideligard.controller('TradePanelCtrl', ['$scope', '$stateParams', '$state', 'stockService', 'accountService',
function($scope, $stateParams, $state, stockService, accountService){
  $scope.stock = stockService.findById($stateParams.id);
  $scope.account = accountService.get();
  $scope.numOwned = accountService.quantityOf($scope.stock);

  // Set Defaults
  $scope.quantity = 1;
  $scope.type = "buy";

  $scope.valid = function(form){
    if($scope.type === 'buy'){
      return accountService.validPurchase($scope.stock, $scope.quantity)
    } else if($scope.type = 'sell') {
      return accountService.validSale($scope.stock, $scope.quantity)
    }
  };

  $scope.placeOrder = function(){
    if($scope.valid()) {
      accountService.placeOrder($scope.stock, $scope.quantity);
      $state.go('index.portfolio');
    }
  }
}]);
