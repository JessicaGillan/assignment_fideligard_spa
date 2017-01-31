fideligard.directive('transactionDataRow', function() {
  return {
    templateUrl: '/js/directives/transactionDataRow.html',
    restrict: 'A',
    scope: {
      transaction: '=' // two way
    }
  }
});
