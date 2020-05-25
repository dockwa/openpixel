!function(window, document, script, http, opix, cacheTime, one, two, three) {
    // return if the setup has already occurred
    // this is to prevent double loading openpixel.js if someone accidentally had this more than once on a page
    if (window[opix]) return;

    // setup the queue to collect all of the calls to openpixel.js before it is loaded
    one = window[opix] = function() {
      // if openpixel.js has loaded, pass the argument through to it
      // if openpixel.js has not loaded yet, queue the calls in an array
      one.process ? one.process.apply(one, arguments) : one.queue.push(arguments)
    }
    // setup an empty queue array
    one.queue = [];
    // get the current time (integer) that the page was loaded and save for later
    one.t = 1 * new Date();

    // create a script tag
    two = document.createElement(script);
    // set the script tag to run async
    two.async = 1;
    // set the source of the script tag and cache bust every 24 hours
    two.src = http + '?t=' + (Math.ceil(new Date()/cacheTime)*cacheTime);

    // get the first <script> that occurs in the document
    // if this block is the only <script> tag on the page it will get this block
    three = document.getElementsByTagName(script)[0];
    // insert the newly created script tag above the first <script> tag in the document
    // this ensures openpixel.js is loaded asynchronously
    three.parentNode.insertBefore(two, three)
}(window, document, 'script', 'JS_URL', 'OPIX_FUNC', 24*60*60*1000);
OPIX_FUNC("init","ID-XXXXXXXX");
OPIX_FUNC("event","pageload");
