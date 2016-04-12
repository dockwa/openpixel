// check if a varaible is not undefined, null, or blank
var isset = function(variable){
  return typeof(variable) !== "undefined" && variable !== null && variable !== '';
}

var guid = function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
