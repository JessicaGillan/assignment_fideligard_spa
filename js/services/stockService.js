fideligard.factory('stockService',['$http', function($http) {
  var _stocks = [],
      _count;

  var _get = function _get() {
    return $http({
      method: 'GET',
      url: '/sample_data.json'
    }).then( function(response) {
      _count = response.data.query.count;

      angular.copy(response.data.query.results.quote, _stocks);
    });
  };

  _get();

  var getStocks = function() {
    return _stocks;
  };

  return {
    get: getStocks
  }
}]);
