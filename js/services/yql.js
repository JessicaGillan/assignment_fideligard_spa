fideligard.factory('yql',['$http', function($http) {
  var _symbols = [];

  var fetchSymbols = function _fetchSymbols() {
    return $http({
      method: 'GET',
      url: 'vendor/companyList.json'
    }).then( function(response) {
      angular.copy(response.data.symbols, _symbols);
      return _symbols
    }, function(response) {
      console.log("error", response);
    });
  };

  var _baseUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata";
  var _endUrl = "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

  var _where = function _where(symbols) {
    var qString = "%20where%20symbol%20in%20(";
    for(var i = 0; i < symbols.length; i++) {
      if(i === (symbols.length - 1)){
        qString += "%22" + symbols[i] + "%22)";
      } else {
        qString += "%22" + symbols[i] + "%22%2C";
      }
    }

    return qString
  }

  var _and = function _and(string, date) {
    date = date.toISOString().substring(0,10);
    return "%20and%20" + string + "%20%3D%20%22"+ date +"%22"
  }

  var _buildUrl = function(symbols, startDate, endDate) {
    return _baseUrl + _where(symbols) + _and("startDate", startDate) + _and("endDate", endDate)+ _endUrl
  }

  var getCompanies = function getCompanies() {
    return _symbols
  }

  var getStocks = function getStocks(symbols, startDate, endDate) {
    console.log(_buildUrl(symbols, startDate, endDate))
    return $http({
      method: 'GET',
      url: _buildUrl(symbols, startDate, endDate)
    })
  }

  return {
    getCompanies: getCompanies,
    getStocks: getStocks,
    fetchSymbols
  }
}]);

// https://query.yahooapis.com/v1/public/yql?q=select%20
// *%20from%20yahoo.finance.historicaldata%20where%20symbol%20in%20
// (%225FH.SI%22%2C%22A31.SI%22)                                        // Stock symbol
// %20and%20startDate%20%3D%20%222015-02-19%22                          // Start date
// %20and%20endDate%20%3D%20%222015-02-24                               // end date
// %22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
