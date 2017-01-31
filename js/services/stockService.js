fideligard.factory('stockService',['$q','$http', 'yql', function($q,$http, yql) {
  var _stocks = [],
      _companies = yql.getCompanies(),
      _count;

  var all = function(startDate, endDate) {
    // Step 1: Build array of HTTP requests with `$http`
    var requests = [];

    // all companies for all dates, TODO: run once and cache!
    for (var start = 0; start < _companies.length; start += 150) {
      var syms = _companies.slice(start, (start + 150));
      requests.push(
        yql.getStocks(syms, startDate, endDate)
      );
    }

    // Step 2: Pass array to `$q.all()`
    return $q.all(requests)

    // Step 3: Call `.then()` like normal
      .then(function(response) {
        // Here we take each dataset and push it onto our array
        for (var i = 0; i < response.length; i++) {
          var stock; // TODO: Account for missing days on weekends, etc. (dateInfo.endDate.getTime() + 86400000)
          for(var j = 0; j < response[i].data.query.results.quote.length; j++){
            stock = response[i].data.query.results.quote[j];
            stock.oneDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 1]);
            stock.sevenDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 7]);
            stock.thirtyDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 30]);

            _stocks.push(stock);
          }
        }

        return _stocks;
      }, function(response) {
        console.error(response);
      });
  };

  var _closeDifference = function _closeDifference(day2, day1) {
    if(day1 && day1.Symbol === day2.Symbol) {
      return day2.Close - day1.Close
    } else {
      return false
    }
  }

  var getStocks = function() {
    return _stocks;
  };

  var getCompanies = function() {
    return _companies;
  };

  var sampleAll = function() { // FOR DEVELOPMENT ONLY
    return $http({
      method: 'GET',
      url: 'eg_stocks.json'
    }).then( function(response) {
      angular.copy(response.data, _stocks);
      return _stocks
    }, function(response) {
      console.log("error", response);
    });
  };

  return {
    get: getStocks,
    all: sampleAll, // FOR DEVELOPMENT ONLY
    getCompanies: getCompanies
  }
}]);
