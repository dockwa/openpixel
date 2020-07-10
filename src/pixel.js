class Pixel {
  constructor(event, timestamp, optional) {
    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optional = Helper.optionalData(optional);
    this.buildParams();
    this.send();
  }

  buildParams() {
    const attr = this.getAttribute();
    for (var index in attr) {
      if (attr.hasOwnProperty(index)) {
        this.setParam(index, attr[index](index));
      }
    }
  }

  getAttribute() {
    return {
      id:           () => Config.id, // website Id
      uid:          () => Cookie.get('uid'), // user Id
      ev:           () => this.event, // event being triggered
      ed:           () => this.optional, // any event data to pass along
      v:            () => Config.version, // openpixel.js version
      dl:           () => window.location.href, // document location
      rl:           () => document.referrer, // referrer location
      ts:           () => this.timestamp, // timestamp when event was triggered
      de:           () => document.characterSet, // document encoding
      sr:           () => window.screen.width + 'x' + window.screen.height, // screen resolution
      vp:           () => window.innerWidth + 'x' + window.innerHeight, // viewport size
      cd:           () => window.screen.colorDepth, // color depth
      dt:           () => document.title, // document title
      bn:           () => Browser.nameAndVersion(), // browser name and version number
      md:           () => Browser.isMobile(), // is a mobile device?
      ua:           () => Browser.userAgent(), // user agent
      tz:           () => (new Date()).getTimezoneOffset(), // timezone
      utm_source:   key => Cookie.getUtm(key), // get the utm source
      utm_medium:   key => Cookie.getUtm(key), // get the utm medium
      utm_term:     key => Cookie.getUtm(key), // get the utm term
      utm_content:  key => Cookie.getUtm(key), // get the utm content
      utm_campaign: key => Cookie.getUtm(key), // get the utm campaign
      ...Config.params
    }
  }

  setParam(key, val) {
    if (Helper.isPresent(val)) {
      this.params.push(`${key}=${encodeURIComponent(val)}`);
    } else {
      this.params.push(`${key}=`);
    }
  }

  send() {
    window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
  }

  sendBeacon() {
    window.navigator.sendBeacon(this.getSourceUrl());
  }

  sendImage() {
    this.img = document.createElement('img');
    this.img.src = this.getSourceUrl();
    this.img.style.display = 'none';
    this.img.width = '1';
    this.img.height = '1';
    document.getElementsByTagName('body')[0].appendChild(this.img);
  }

  getSourceUrl() {
    return `${pixelEndpoint}?${this.params.join('&')}`;
  }
}
