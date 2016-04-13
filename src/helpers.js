// check if a varaible is not undefined, null, or blank
var isset = function(variable){
  return typeof(variable) !== "undefined" && variable !== null && variable !== '';
}

var guid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}
