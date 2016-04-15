// update the cookie if it exists, if it doesn't, create a new one, lasting 2 years
Cookie.exists('uid') ? Cookie.set('uid', Cookie.get('uid'), 2*365*24*60) : Cookie.set('uid', guid(), 2*365*24*60);
// save any utms through as session cookies
Cookie.setUtms();

// process the queue and future incoming commands
pixelFunc.process = function(method, value) {
  if(method == 'init') {
    Config.id = value;
  } else if(method == 'event') {
    if(value == 'pageload' && !Config.pageLoadOnce && !Cookie.exists('pageload')){
      Config.pageLoadOnce = true;
      // set 10 minutes page load cookie
      Cookie.throttle('pageload');
      new Pixel(value, pixelFunc.t);
    } else if(value != 'pageload' && value != 'pageclose'){
      new Pixel(value, 1*new Date);
    }
  }
}

// run the queued calls from the snippet to be processed
for(var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function() {
  if(!Config.pageCloseOnce && !Cookie.exists('pageclose')){
    Config.pageCloseOnce = true;
    // set 10 minutes page close cookie
    Cookie.throttle('pageclose');
    new Pixel('pageclose', 1*new Date);
  }
});
