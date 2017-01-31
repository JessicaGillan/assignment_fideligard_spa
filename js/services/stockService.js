fideligard.factory('stockService',['$q','$http','_', 'yql', function($q, $http, _, yql) {
  var _stocks = [],
      _dateIndex = {},
      _companies = yql.getCompanies(),
      _count;

  var all = function(startDate, endDate) {
    // Step 1: Build array of HTTP requests with `$http`
    var requests = [];
    angular.copy([], _stocks);
    // all companies for all dates, TODO: run once and cache!
    // for (var start = 0; start < _companies.length; start += 150) {
    //   var syms = _companies.slice(start, (start + 150));
    //   requests.push(
    //     yql.getStocks(syms, startDate, endDate)
    //   );
    // }

    var syms = _companies.slice(0, 150); // FOR DEVELOPMENT
    requests.push(
      yql.getStocks(syms, startDate, endDate)
    );

    // Step 2: Pass array to `$q.all()`
    return $q.all(requests)

    // Step 3: Call `.then()` like normal
      .then(function(response) {
        // Here we take each dataset and push it onto our array
        var id = 0;
        for (var i = 0; i < response.length; i++) {
          var stock; // TODO: Account for missing days on weekends, etc. (dateInfo.endDate.getTime() + 86400000)
          for(var j = 0; j < response[i].data.query.results.quote.length; j++){
            stock = response[i].data.query.results.quote[j];
            stock.id = id;
            stock.oneDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 1]);
            stock.sevenDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 7]);
            stock.thirtyDayDiff = _closeDifference(stock,response[i].data.query.results.quote[j - 30]);

            _dateIndex[stock.Date] ? _dateIndex[stock.Date].push(id) : _dateIndex[stock.Date] = [id];

            _stocks.push(stock);

            id++;
          }
        }

        return _stocks;
      }, function(response) {
        console.error(response);
      });
  };

  // TODO: ACCOUNT FOR MISSING DAYS
  // get stock at i and next, if they dont match, duplicate stock at i for next - first - 1 days

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
    var deferred = $q.defer();

    if (_stocks.length) { // if cached
      // Resolve the deferred $q object before returning the promise
      deferred.resolve(_stocks);
      return deferred.promise;
    }
    // else- not in cache
    $http({
      method: 'GET',
      url: 'eg_stocks.json'
    }).then( function(response) {
      angular.copy(response.data, _stocks);
      deferred.resolve(_stocks);
    }, function(response) {
      console.log("error", response);
      deferred.reject("Error: returned status " + response.status);
    });
    return deferred.promise;
  };

  var findById = function findById(id) {
    id = parseInt(id);

    if(_stocks[id] && _stocks[id].id === id) return _stocks[id];

    return _.find(_stocks, function(stock){ return stock.id === id; });
  }

  return {
    get: getStocks,
    all: sampleAll, // FOR DEVELOPMENT ONLY
    getCompanies: getCompanies,
    findById: findById
  }
}]);
