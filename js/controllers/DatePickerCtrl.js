fideligard.controller('DatePickerCtrl', ['$scope', 'dateService', function($scope, dateService){
  var _$dPicker = $('#date-picker'),
      _$dLabel = $('#date-label'),
      _$lWrapper = $('#label-wrapper');

  var _moveLabel = function moveLabel() {
    // Move label to slider position
    _$dLabel.css({ left: (_$dPicker[0].clientWidth - 15) / 364 * _$dPicker[0].value })
  }

  var _updateDatePicker = function _updateDatePicker() {
    $scope.dateStep = dateService.getDateAsStep(); //set date-picker model value
    console.log($scope.dateStep)
    // TODO:NOT SETTING IT ON FIRST CALL
    _$dPicker[0].value = $scope.dateStep; //set date-picker slider value
    console.log("val",  _$dPicker[0].value)

    _moveLabel();
  }

  var _addEventListeners = function addEventListeners() {
    _$dPicker.on('input', function(e) {
      dateService.setDateFromStep(e.target.value);
      _moveLabel();
      $scope.textInput = false;
    });
  };

  $scope.updateDate = function() {
    dateService.setDate($scope.dateInput);
    _updateDatePicker();
    $scope.textInput = false;
  }

  $scope.dateInfo = dateService.get();
  $scope.textInput = false;

  _addEventListeners();
  _updateDatePicker();
}]);
