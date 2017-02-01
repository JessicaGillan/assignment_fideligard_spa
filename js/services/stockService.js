fideligard.factory('stockService',['$q','$http','_', 'yql', function($q, $http, _, yql) {
  var _dateIndex = {},
      _companies = yql.getCompanies(),
      _count,
      MILLIS_DAY = 86400000;

  var all = function(startDate, endDate) {
    // Step 1: Build array of HTTP requests with `$http`
    var requests = [];
    angular.copy([], _dateIndex);
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
          var counter = response[i].data.query.results.quote.length;
          while(counter--) {
            stock = response[i].data.query.results.quote[counter];
            stock.id = id;
            stock.oneDayDiff = _closeDifference(response[i].data.query.results.quote, counter, 1);
            stock.sevenDayDiff = _closeDifference(response[i].data.query.results.quote, counter, 7);
            stock.thirtyDayDiff = _closeDifference(response[i].data.query.results.quote, counter,  30);

            _dateIndex[stock.Date] ? _dateIndex[stock.Date].push(stock) : _dateIndex[stock.Date] = [stock];

            id++;
          }
        }

        _fillInMissingDates(startDate, endDate);

        return _dateIndex
      }, function(response) {
        console.error(response);
      });
  };

  // PRIVATE

  var _fillInMissingDates = function _fillInMissingDates(start, end){
    var currStr = start.toISOString().slice(0,10);
    var curr = start;

    // Find first filled date
    var firstFilled = start;
    var firstStr = firstFilled.toISOString().slice(0,10);
    while(!_dateIndex[firstStr]){
      firstFilled = new Date(Date.parse(firstStr) + MILLIS_DAY);
      firstStr = firstFilled.toISOString().slice(0,10)
    }

    // Fill in all dates with prior info if empty
    while(curr <= end){
      if(!_dateIndex[currStr]) {
        _dateIndex[currStr] = _dateIndex[firstStr];
        curr = new Date(Date.parse(currStr) + MILLIS_DAY);
        currStr = curr.toISOString().slice(0,10);
      } else {
        firstStr = currStr;
        curr = new Date(Date.parse(currStr) + MILLIS_DAY);
        currStr = curr.toISOString().slice(0,10);
      }
    }

    return _dateIndex;
  }

  var _dateDaysAgo = function _dateDaysAgo(dateStr, numDays) { // dateStr format = 'yyyy-mm-dd'
    return new Date(Date.parse(dateStr) - numDays * MILLIS_DAY)
  }

  var _closeDifference = function _closeDifference(collection, currentIndex, num) {
    var targetDate = _dateDaysAgo(collection[currentIndex].Date, num);
    nextIndex = currentIndex + 1;

    // While in collection, for same company, and haven't hit target date
    // keep moving forward in collection (which goes down in date)
    while(collection[nextIndex] &&
          collection[nextIndex].Symbol === collection[currentIndex].Symbol &&
          Date.parse(collection[nextIndex].Date) > Date.parse(targetDate)){
          nextIndex++;
    }

    if(!collection[nextIndex]) return false;
    if(collection[nextIndex].Symbol !== collection[currentIndex].Symbol) return false;

    return parseFloat(collection[nextIndex].Close) - parseFloat(collection[currentIndex].Close);
  }

  var getStocks = function() {
    return _dateIndex;
  };

  var getCompanies = function() {
    return _companies;
  };

  var sampleAll = function() { // FOR DEVELOPMENT ONLY
    var deferred = $q.defer();

    if (_dateIndex.length) { // if cached
      // Resolve the deferred $q object before returning the promise
      deferred.resolve(_stocks);
      return deferred.promise;
    }
    // else- not in cache
    $http({
      method: 'GET',
      url: 'sample_3_stock_date.json'
    }).then( function(response) {
      angular.copy(response.data, _dateIndex);
      deferred.resolve(_dateIndex);
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
    all: sampleAll, // sampleAll, // FOR DEVELOPMENT ONLY
    getCompanies: getCompanies,
    findById: findById
  }
}]);
