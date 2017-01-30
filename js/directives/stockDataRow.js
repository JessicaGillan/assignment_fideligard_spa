fideligard.directive('stockDataRow', function() {
  return {
    templateUrl: '/js/directives/stockDataRow.html',
    restrict: 'A',
    scope: {
      stock: '=' // two way
    }
  }
});
