fideligard.factory('stockService',['$http', function($http) {
  var _stocks = [],
      _count;

  var _get = function _get() {
    return $http({
      method: 'GET',
      url: '/sample_data.json'
    }).then( function(response) {
      _count = response.data.query.count;

      angular.copy([], _stocks); // Clear old data

      var stock;
      for(var i = 0; i < response.data.query.results.quote.length; i++){
        stock = response.data.query.results.quote[i];
        stock.oneDayDiff = _closeDifference(stock,response.data.query.results.quote[i - 1]);
        stock.sevenDayDiff = _closeDifference(stock,response.data.query.results.quote[i - 7]);
        stock.thirtyDayDiff = _closeDifference(stock,response.data.query.results.quote[i - 30]);

        _stocks.push(stock);
      }
    });
  };

  var _closeDifference = function _closeDifference(day2, day1) {
    if(day1) {
      return day2.Close - day1.Close
    } else {
      return false
    }
  }

  _get();

  var getStocks = function() {
    return _stocks;
  };

  return {
    get: getStocks
  }
}]);
