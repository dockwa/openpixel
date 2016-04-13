// process the queue and future incoming commands
pixelFunc.process = function(event, value) {
  if(event == 'pageclose') return;
  switch(event) {
    case 'init':
      Config.id = value;
      // update the cookie if it exists, if it doesn't, create a new one
      Cookie.exists('uid') ? Cookie.set('uid', Cookie.get('uid'), 2*365*24*60) : Cookie.set('uid', guid(), 2*365*24*60);
      break;
    case 'pageload':
      if(!Config.pageViewOnce && !Cookie.exists('pageload')){
        Config.pageViewOnce = true;
        // set 10 minutes page load cookie
        Cookie.throttle('pageload');
        new Pixel(value, pixelFunc.t);
      }
    default:
      new Pixel(value, 1*new Date);
  }
}

// run the queued calls from the snippet to be processed
for(var i = 0, l = pixelFunc.queue.length; i < l; i++){
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
