fideligard.directive('portfolioDataRow', function() {
  return {
    templateUrl: '/js/directives/portfolioDataRow.html',
    restrict: 'A',
    scope: {
      portData: '=' // two way
    }
  }
});
