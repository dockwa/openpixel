// check if a varaible is not undefined, null, or blank
var isset = function(variable){
  return typeof(variable) !== "undefined" && variable !== null && variable !== '';
}

var guid = function() {
  return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function(c) {
      var r = Math.random()*36|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(36);
  }) + (1 * new Date()).toString(36);
}
