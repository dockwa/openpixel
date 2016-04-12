var Controller = {
  process:  function(event, value){
    if(event == 'init'){
      Config.id = value;
      if(!Cookie.exists('uid')){
        // set guid for user for 2 years
        Cookie.set('uid', guid(), 2*365*24*60);
      }
    } else if(value == 'pageview'){
      if(!Config.pageViewOnce && !Cookie.exists('pageview')){
        Config.pageViewOnce = true;
        // set 10 minutes page view cookie
        Cookie.set('pageview', 'true', 10, window.location.pathname);
        new Pixel(value, pixelFunc.t);
      }
    } else if(event == 'event' && value != 'pageclose'){
      new Pixel(value, 1*new Date);
    }
  },
}


// process the queue and future incoming commands
pixelFunc.process = function() {
  Controller.process.apply(this, arguments);
}

// run the queued calls from the snippet to be processed
for(var i = 0, l = pixelFunc.queue.length; i < l; i++){
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function(event) {
  if(!Config.pageCloseOnce && !Cookie.exists('pageclose')){
    Config.pageCloseOnce = true;
    // set 10 minutes page close cookie
    Cookie.set('pageclose', 'true', 10, window.location.pathname);
    new Pixel('pageclose', 1*new Date);
  }
});
