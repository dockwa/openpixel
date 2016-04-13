//http://www.w3schools.com/js/js_cookies.asp
var Cookie = {

  prefix(){
    return  '__' + pixelFuncName + '_';
  },

  set(name, value, minutes, path = "/") {
    var expires = "";
    if (isset(minutes)) {
      var date = new Date();
      date.setTime(date.getTime()+(minutes*60*1000));
      expires = "; expires="+date.toGMTString();
    }
    document.cookie = this.prefix() + name + "=" + value + expires + "; path=" + path;
  },

  get(name) {
    var name = this.prefix() + name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return;
  },

  delete(name){
    this.set(name,"",-100);
  },

  exists(name){
    return isset(this.get(name));
  },

  // set a cookie that expires in 10 minutes to throttle analytics requests from that page
  throttle(name){
    this.set(name, 1, 10, window.location.pathname);
  }

}
