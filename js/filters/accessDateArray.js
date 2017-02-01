fideligard.filter('accessDateArray', [
  function(){
    return function(obj, date){
      var itemArr = obj[date.toISOString().slice(0,10)];
      return obj[date.toISOString().slice(0,10)];
    };
  }
]);
