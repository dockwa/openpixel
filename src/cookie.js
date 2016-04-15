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
  },

  setUtms(){
    var utmArray = ['utm_source','utm_medium','utm_term','utm_content','utm_campaign'];
    var exists = false;
    for(var i = 0, l = utmArray.length; i < l; i++){
      if( isset(Url.getParameterByName(utmArray[i])) ){
        exists = true;
        break;
      }
    }
    if(exists){
      var val, save = {};
      for(var i = 0, l = utmArray.length; i < l; i++){
        val = Url.getParameterByName(utmArray[i]);
        if(isset(val)){
          save[utmArray[i]] = val;
        }
      }
      this.set('utm', JSON.stringify(save));
    }
  },

  getUtm(name){
    if(this.exists('utm')){
      var utms = JSON.parse(this.get('utm'));
      return name in utms ? utms[name] : "";
    }
  }

}
