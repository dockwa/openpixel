class Helpers {
  static isPresent(variable) {
    return typeof(variable) !== 'undefined' && variable !== null && variable !== '';
  }

  static now() {
    return 1 * new Date;
  }

  static guid() {
    return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function(c) {
        var r = Math.random()*36|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(36);
    }) + (1 * new Date()).toString(36);
  }

  // reduces all optional data down to a string
  static optionalData(data) {
    if (Helpers.isPresent(data) === false) {
      return '';
    } else if (typeof data === 'object') {
      // runs Helpers.optionalData again to reduce to string in case something else was returned
      return Helpers.optionalData(JSON.stringify(data));
    } else if (typeof data === 'function') {
      // runs the function and calls Helpers.optionalData again to reduce further if it isn't a string
      return Helpers.optionalData(data());
    } else {
      return String(data);
    }
  }
}
