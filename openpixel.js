// Open Pixel v1.0.0 | Created By Stuart Yamartino | MIT License | Copyright (c) 2016 Dockwa, Inc.
;(function(window, document, pixelFunc, pixelFuncName, pixelEndpoint) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = {
  id: '',
  version: '1'
};

// check if a varaible is not undefined, null, or blank
var isset = function isset(variable) {
  return typeof variable !== "undefined" && variable !== null && variable !== '';
};

var guid = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

var Browser = {
  nameAndVersion: function nameAndVersion() {
    // http://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
    var ua = navigator.userAgent,
        tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  },
  isMobile: function isMobile() {
    return 'ontouchstart' in document;
  },
  userAgent: function userAgent() {
    return window.navigator.userAgent;
  }
};

//http://www.w3schools.com/js/js_cookies.asp
var Cookie = {
  prefix: function prefix() {
    return '__' + pixelFuncName + '_';
  },
  set: function set(name, value, minutes) {
    var path = arguments.length <= 3 || arguments[3] === undefined ? "/" : arguments[3];

    var expires = "";
    if (isset(minutes)) {
      var date = new Date();
      date.setTime(date.getTime() + minutes * 60 * 1000);
      expires = "; expires=" + date.toGMTString();
    }
    document.cookie = this.prefix() + name + "=" + value + expires + "; path=" + path;
  },
  get: function get(name) {
    var name = this.prefix() + name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return;
  },
  delete: function _delete(name) {
    this.set(name, "", -100);
  },
  exists: function exists(name) {
    return isset(this.get(name));
  }
};

var Url = {
  // http://stackoverflow.com/a/901144/1231563

  getParameterByName: function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  },
  hasParameter: function hasParameter(name, url) {
    return isset(getParameterByName(name, url));
  }
};

var Pixel = function () {
  function Pixel(event, timestamp) {
    _classCallCheck(this, Pixel);

    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.getAttribute();
    this.buildParams();
    this.send();
  }

  _createClass(Pixel, [{
    key: 'getAttribute',
    value: function getAttribute() {
      this.attr = {
        id: function id() {
          return Config.id;
        }, // website Id
        uid: function uid() {
          return Cookie.get('uid');
        }, // user Id
        ev: function ev() {
          return event;
        }, // event being triggered
        v: function v() {
          return Config.version;
        }, // openpixel.js version
        dl: function dl() {
          return window.location.href;
        }, // document location
        rl: function rl() {
          return document.referrer;
        }, // referrer location
        ts: function ts() {
          return pixelFunc.t;
        }, // timestamp when event was triggered
        de: function de() {
          return document.characterSet;
        }, // document encoding
        sr: function sr() {
          return window.screen.width + 'x' + window.screen.height;
        }, // screen resolution
        vp: function vp() {
          return window.innerWidth + 'x' + window.innerHeight;
        }, // viewport size
        cd: function cd() {
          return window.screen.colorDepth;
        }, // color depth
        dt: function dt() {
          return document.title;
        }, // document title
        bn: function bn() {
          return Browser.nameAndVersion();
        }, // browser name and version number
        md: function md() {
          return Browser.isMobile();
        }, // is a mobile device?
        ua: function ua() {
          return Browser.userAgent();
        }, // user agent
        utm_source: function utm_source(key) {
          return Url.getParameterByName(key);
        }, // get the utm source
        utm_medium: function utm_medium(key) {
          return Url.getParameterByName(key);
        }, // get the utm medium
        utm_term: function utm_term(key) {
          return Url.getParameterByName(key);
        }, // get the utm term
        utm_content: function utm_content(key) {
          return Url.getParameterByName(key);
        }, // get the utm concent
        utm_campaign: function utm_campaign(key) {
          return Url.getParameterByName(key);
        } };
    }
  }, {
    key: 'buildParams',
    // get the utm campaign
    value: function buildParams() {
      for (var index in this.attr) {
        if (this.attr.hasOwnProperty(index)) {
          this.setParam(index, [this.attr[index]](index));
        }
      }
    }
  }, {
    key: 'setParam',
    value: function setParam(key, val) {
      if (isset(val)) {
        this.params.push(key + '=' + val);
      } else {
        this.params.push(key + '=');
      }
    }
  }, {
    key: 'send',
    value: function send() {
      window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
    }
  }, {
    key: 'sendBeacon',
    value: function sendBeacon() {
      window.navigator.sendBeacon(this.getSourceUrl());
    }
  }, {
    key: 'sendImg',
    value: function sendImg() {
      this.img = document.createElement('img');
      this.img.src = this.getSourceUrl();
      this.img.style.display = 'none';
      this.img.width = '1';
      this.img.height = '1';
      document.getElementsByTagName('body')[0].appendChild(this.img);
    }
  }, {
    key: 'getSourceUrl',
    value: function getSourceUrl() {
      return pixelEndpoint + '?' + encodeURI(this.params.join('&'));
    }
  }]);

  return Pixel;
}();

var Controller = {
  process: function process(event, value) {
    if (event == 'init') {
      Config.id = value;
      if (!Cookie.exists('uid')) {
        // set guid for user for 2 years
        Cookie.set('uid', guid(), 2 * 365 * 24 * 60);
      }
    } else if (value == 'pageload') {
      if (!Config.pageViewOnce && !Cookie.exists('pageload')) {
        Config.pageViewOnce = true;
        // set 10 minutes page view cookie
        Cookie.set('pageload', 'true', 10, window.location.pathname);
        new Pixel(value, pixelFunc.t);
      }
    } else if (event == 'event' && value != 'pageclose') {
      new Pixel(value, 1 * new Date());
    }
  }
};

// process the queue and future incoming commands
pixelFunc.process = function () {
  Controller.process.apply(this, arguments);
};

// run the queued calls from the snippet to be processed
for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function (event) {
  if (!Config.pageCloseOnce && !Cookie.exists('pageclose')) {
    Config.pageCloseOnce = true;
    // set 10 minutes page close cookie
    Cookie.set('pageclose', 'true', 10, window.location.pathname);
    new Pixel('pageclose', 1 * new Date());
  }
});
}(window, document, window["opix"], "opix", "http://stu.ngrok.io/pixel.gif"));
