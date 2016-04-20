// update the cookie if it exists, if it doesn't, create a new one, lasting 2 years
Cookie.exists('uid') ? Cookie.set('uid', Cookie.get('uid'), 2*365*24*60) : Cookie.set('uid', guid(), 2*365*24*60);
// save any utms through as session cookies
Cookie.setUtms();

// process the queue and future incoming commands
pixelFunc.process = function(method, value, optinal) {
  if(method == 'init') {
    Config.id = value;
  } else if(method == 'event') {
    if(value == 'pageload' && !Config.pageLoadOnce){
      Config.pageLoadOnce = true;
      // set 10 minutes page load cookie
      // Cookie.throttle('pageload');
      new Pixel(value, pixelFunc.t, optinal);
    } else if(value != 'pageload' && value != 'pageclose'){
      new Pixel(value, now(), optinal);
    }
  }
}

// run the queued calls from the snippet to be processed
for(var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function() {
  if(!Config.pageCloseOnce){
    Config.pageCloseOnce = true;
    // set 10 minutes page close cookie
    // Cookie.throttle('pageclose');
    new Pixel('pageclose', now(), function(){
      // if a link was clicked in the last 5 seconds that goes to an extenal host, pass it through as event data
      if(isset(Config.externalHost) && (now() - Config.externalHost.time) < 5*1000){
        return Config.externalHost.link;
      }
    });
  }
});

window.onload = function() {
  var aTags = document.getElementsByTagName('a');
  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].onclick = function(e) {
      if(Url.externalHost(this)){
        Config.externalHost = {link:this.href, time:now()};
      }
    }.bind(aTags[i])
  }
}
