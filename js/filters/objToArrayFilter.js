fideligard.filter('objToArrayFilter', [
  function(){
    return function(obj){
      var arr = [];

      for(var key in obj) arr.push(obj[key]);
      console.log("return arr", arr)
      return arr
    };
  }
]);
