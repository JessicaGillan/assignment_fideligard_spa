fideligard.controller('StockPanelCtrl', ['$scope', 'stockService', 'dateService', function($scope, stockService, dateService){
  $scope.stocks = stockService.get();
  $scope.dateInfo = dateService.get();

}]);
