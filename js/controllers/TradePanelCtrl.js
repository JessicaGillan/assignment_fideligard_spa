fideligard.controller('TradePanelCtrl', ['$scope', 'stockService', 'dateService', function($scope, stockService, dateService){
  $scope.symbols = stockService.getCompanies();

  // stockService.all($scope.dateInfo.startDate, $scope.dateInfo.endDate);
  // $scope.stocks = stockService.get();
}]);
