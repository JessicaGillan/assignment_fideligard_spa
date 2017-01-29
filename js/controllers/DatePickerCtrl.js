fideligard.controller('DatePickerCtrl', ['$scope', 'dateService', function($scope, dateService){
  var _addEventListeners = function addEventListeners() {
    var $dp = $('#date-picker');
    $dp.on('input', function(e) {
      $('#date-label').css({ left: (e.target.clientWidth - 15) / 364 * e.target.value });
      dateService.setDateFromStep(e.target.value);
    });
  };

  var _initializeValues =function() {
    $scope.dateStep = dateService.getDateAsStep(); //set date-picker model value

    dp = $('#date-picker')[0]; //set date-picker slider value
    dp.value = $scope.dateStep;

    // Move label to starting position
    $('#date-label').css({ left: (dp.clientWidth - 15) / 364 * dp.value })
  }

  $scope.dateInfo = dateService.get();

  _addEventListeners();
  _initializeValues();

}]);
