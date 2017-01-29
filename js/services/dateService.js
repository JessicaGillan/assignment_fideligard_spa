fideligard.factory('dateService', function() {
  var _dateInfo = {
    date: new Date('2016-06-15'),
    startDate: new Date('2016-01-02'),
    endDate: new Date('2017-01-01'),
    numSteps: 365 // 2016 had 366 days, 1 - 366
  };

  var get = function(){
    return _dateInfo
  };

  var getDateAsStep = function(){
    if(_dateInfo.date < _dateInfo.startDate) return 1;
    if(_dateInfo.date > _dateInfo.endDate) return numberSteps + 1;

    return Math.floor((_dateInfo.numSteps/(_dateInfo.endDate - _dateInfo.startDate)) * ( _dateInfo.date - _dateInfo.startDate))
  };

  var setDateFromStep = function(step){
    var millisDate = (((_dateInfo.endDate - _dateInfo.startDate)/_dateInfo.numSteps) * step) + _dateInfo.startDate.getTime();

    _dateInfo.date.setTime(millisDate)

    console.log("_dateInfo.date is", _dateInfo.date)
    return _dateInfo
  };

  return {
    get: get,
    getDateAsStep: getDateAsStep,
    setDateFromStep: setDateFromStep
  }
});
