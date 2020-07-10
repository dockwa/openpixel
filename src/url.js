class Url {
  // http://stackoverflow.com/a/901144/1231563
  static getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  static externalHost(link) {
    return link.hostname != location.hostname && link.protocol.indexOf('http') === 0;
  }
}
