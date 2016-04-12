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
  function Pixel(event) {
    _classCallCheck(this, Pixel);

    this.params = [];
    this.event = event;
    this.attr = {
      id: 'getId',
      uid: 'getUserId',
      ev: 'getEvent',
      v: 'getVerion',
      dl: 'getDocumentLocation',
      rl: 'getReferrerLocation',
      ts: 'getTimestamp',
      de: 'getDocumentEncoding',
      sr: 'getScreenResolution',
      vp: 'getViewport',
      cd: 'getColorDepth',
      dt: 'getDocumentTitle',
      bn: 'getBrowserName',
      md: 'getMobileDevice',
      ua: 'getUserAgent',
      utm_source: 'getUtmSource',
      utm_medium: 'getUtmMedium',
      utm_term: 'getUtmTerm',
      utm_content: 'getUtmContent',
      utm_campaign: 'getUtmCampaign'
    };
    this.buildParams();
    this.send();
  }

  _createClass(Pixel, [{
    key: 'buildParams',
    value: function buildParams() {
      for (var index in this.attr) {
        if (this.attr.hasOwnProperty(index)) {
          this.setParam(index, this[this.attr[index]](index));
        }
      }
    }
  }, {
    key: 'getId',
    value: function getId() {
      return Config.id;
    }
  }, {
    key: 'getUserId',
    value: function getUserId() {
      return Cookie.get('uid');
    }
  }, {
    key: 'getEvent',
    value: function getEvent() {
      return this.event;
    }
  }, {
    key: 'getVerion',
    value: function getVerion() {
      return Config.version;
    }
  }, {
    key: 'getDocumentLocation',
    value: function getDocumentLocation() {
      return window.location.href;
    }
  }, {
    key: 'getReferrerLocation',
    value: function getReferrerLocation() {
      return document.referrer;
    }
  }, {
    key: 'getTimestamp',
    value: function getTimestamp() {
      return pixelFunc.t;
    }
  }, {
    key: 'getDocumentEncoding',
    value: function getDocumentEncoding() {
      return document.characterSet;
    }
  }, {
    key: 'getScreenResolution',
    value: function getScreenResolution() {
      return window.screen.width + 'x' + window.screen.height;
    }
  }, {
    key: 'getViewport',
    value: function getViewport() {
      return window.innerWidth + 'x' + window.innerHeight;
    }
  }, {
    key: 'getColorDepth',
    value: function getColorDepth() {
      return window.screen.colorDepth;
    }
  }, {
    key: 'getDocumentTitle',
    value: function getDocumentTitle() {
      return document.title;
    }
  }, {
    key: 'getBrowserName',
    value: function getBrowserName() {
      return Browser.nameAndVersion();
    }
  }, {
    key: 'getMobileDevice',
    value: function getMobileDevice() {
      return Browser.isMobile();
    }
  }, {
    key: 'getUserAgent',
    value: function getUserAgent() {
      return Browser.userAgent();
    }
  }, {
    key: 'getUtmSource',
    value: function getUtmSource(key) {
      return Url.getParameterByName(key);
    }
  }, {
    key: 'getUtmMedium',
    value: function getUtmMedium(key) {
      return Url.getParameterByName(key);
    }
  }, {
    key: 'getUtmTerm',
    value: function getUtmTerm(key) {
      return Url.getParameterByName(key);
    }
  }, {
    key: 'getUtmContent',
    value: function getUtmContent(key) {
      return Url.getParameterByName(key);
    }
  }, {
    key: 'getUtmCampaign',
    value: function getUtmCampaign(key) {
      return Url.getParameterByName(key);
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
    } else if (value == 'pageview') {
      if (!Config.pageViewOnce && !Cookie.exists('pageview')) {
        Config.pageViewOnce = true;
        // set 10 minutes page view cookie
        Cookie.set('pageview', 'true', 10, window.location.pathname);
        new Pixel(value);
      }
    } else if (event == 'event' && value != 'pageclose') {
      new Pixel(value);
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
    new Pixel('pageclose');
  }
});
}(window, document, window["opix"], "opix", "http://stu.ngrok.io/pixel.gif"));
