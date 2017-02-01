fideligard.filter('buildArrayUpToDate', [
  function(){
    // TODO: "date walking", & "date to str" should be REFACTORED in to helpers
    // DRY it up, used multiple places
    return function(obj, startDate, endDate){
      var itemArr = [];
      var curr = startDate;
      var currStr = curr.toISOString().slice(0,10);

      while(curr <= endDate){
        if(obj[currStr]) itemArr.push(obj[currStr]); // TODO: find out why itemArr.concat does NOT work

        curr = new Date(Date.parse(currStr) + 86400000);
        currStr = curr.toISOString().slice(0,10);
      }
      return [].concat.apply([], itemArr); // Hack since can't .concat
    };
  }
]);
