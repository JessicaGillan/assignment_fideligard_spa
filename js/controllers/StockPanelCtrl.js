fideligard.controller('StockPanelCtrl', ['$scope', 'stockService', 'dateService', function($scope, stockService, dateService){
  $scope.dateInfo = dateService.get();
  $scope.symbols = stockService.getCompanies();

  stockService.all($scope.dateInfo.startDate, $scope.dateInfo.endDate);
  $scope.stocks = stockService.get();
}]);
