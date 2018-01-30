// Open Pixel v1.0.0 | Published By Dockwa | Created By Stuart Yamartino | MIT License
;(function(window, document, pixelFunc, pixelFuncName, pixelEndpoint, versionNumber) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = {
  id: '',
  version: versionNumber

  // check if a variable is not undefined, null, or blank
};var isset = function isset(variable) {
  return typeof variable !== "undefined" && variable !== null && variable !== '';
};

var now = function now() {
  return 1 * new Date();
};

var guid = function guid() {
  return Config.version + '-xxxxxxxx-'.replace(/[x]/g, function (c) {
    var r = Math.random() * 36 | 0,
        v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(36);
  }) + (1 * new Date()).toString(36);
};

// reduces all optional data down to a string
var optinalData = function optinalData(data) {
  if (isset(data) === false) {
    return '';
  } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    // runs optinalData again to reduce to string in case something else was returned
    return optinalData(JSON.stringify(data));
  } else if (typeof data === 'function') {
    // runs the function and calls optinalData again to reduce further if it isn't a string
    return optinalData(data());
  } else {
    return String(data);
  }
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
    var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "/";

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
  },


  // set a cookie that expires in 10 minutes to throttle analytics requests from that page
  // throttle(name){
  //   this.set(name, 1, 10, window.location.pathname);
  // },

  setUtms: function setUtms() {
    var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
    var exists = false;
    for (var i = 0, l = utmArray.length; i < l; i++) {
      if (isset(Url.getParameterByName(utmArray[i]))) {
        exists = true;
        break;
      }
    }
    if (exists) {
      var val,
          save = {};
      for (var i = 0, l = utmArray.length; i < l; i++) {
        val = Url.getParameterByName(utmArray[i]);
        if (isset(val)) {
          save[utmArray[i]] = val;
        }
      }
      this.set('utm', JSON.stringify(save));
    }
  },
  getUtm: function getUtm(name) {
    if (this.exists('utm')) {
      var utms = JSON.parse(this.get('utm'));
      return name in utms ? utms[name] : "";
    }
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
  externalHost: function externalHost(link) {
    return link.hostname != location.hostname && link.protocol.indexOf('http') === 0;
  }
};

var Pixel = function () {
  function Pixel(event, timestamp, optinal) {
    _classCallCheck(this, Pixel);

    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optinal = optinalData(optinal);
    this.buildParams();
    this.send();
  }

  _createClass(Pixel, [{
    key: 'buildParams',
    value: function buildParams() {
      var attr = this.getAttribute();
      for (var index in attr) {
        if (attr.hasOwnProperty(index)) {
          this.setParam(index, attr[index](index));
        }
      }
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute() {
      var _this = this;

      return {
        id: function id() {
          return Config.id;
        }, // website Id
        uid: function uid() {
          return Cookie.get('uid');
        }, // user Id
        ev: function ev() {
          return _this.event;
        }, // event being triggered
        ed: function ed() {
          return _this.optinal;
        }, // any event data to pass along
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
          return _this.timestamp;
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
          return Cookie.getUtm(key);
        }, // get the utm source
        utm_medium: function utm_medium(key) {
          return Cookie.getUtm(key);
        }, // get the utm medium
        utm_term: function utm_term(key) {
          return Cookie.getUtm(key);
        }, // get the utm term
        utm_content: function utm_content(key) {
          return Cookie.getUtm(key);
        }, // get the utm concent
        utm_campaign: function utm_campaign(key) {
          return Cookie.getUtm(key);
        } // get the utm campaign
      };
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
    key: 'sendImage',
    value: function sendImage() {
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

// update the cookie if it exists, if it doesn't, create a new one, lasting 2 years


Cookie.exists('uid') ? Cookie.set('uid', Cookie.get('uid'), 2 * 365 * 24 * 60) : Cookie.set('uid', guid(), 2 * 365 * 24 * 60);
// save any utms through as session cookies
Cookie.setUtms();

// process the queue and future incoming commands
pixelFunc.process = function (method, value, optinal) {
  if (method == 'init') {
    Config.id = value;
  } else if (method == 'event') {
    if (value == 'pageload' && !Config.pageLoadOnce) {
      Config.pageLoadOnce = true;
      // set 10 minutes page load cookie
      // Cookie.throttle('pageload');
      new Pixel(value, pixelFunc.t, optinal);
    } else if (value != 'pageload' && value != 'pageclose') {
      new Pixel(value, now(), optinal);
    }
  }
};

// run the queued calls from the snippet to be processed
for (var i = 0, l = pixelFunc.queue.length; i < l; i++) {
  pixelFunc.process.apply(pixelFunc, pixelFunc.queue[i]);
}

window.addEventListener('unload', function () {
  if (!Config.pageCloseOnce) {
    Config.pageCloseOnce = true;
    // set 10 minutes page close cookie
    // Cookie.throttle('pageclose');
    new Pixel('pageclose', now(), function () {
      // if a link was clicked in the last 5 seconds that goes to an external host, pass it through as event data
      if (isset(Config.externalHost) && now() - Config.externalHost.time < 5 * 1000) {
        return Config.externalHost.link;
      }
    });
  }
});

window.onload = function () {
  var aTags = document.getElementsByTagName('a');
  for (var i = 0, l = aTags.length; i < l; i++) {
    aTags[i].addEventListener('click', function (e) {
      if (Url.externalHost(this)) {
        Config.externalHost = { link: this.href, time: now() };
      }
    }.bind(aTags[i]));
  }
};
}(window, document, window["opix"], "opix", "https://tracker.example.com/pixel.gif", 1));
