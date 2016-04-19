class Pixel {
  constructor(event, timestamp, optinal){
    this.params = [];
    this.event = event;
    this.timestamp = timestamp;
    this.optinal = optinalData(optinal);
    this.buildParams();
    this.send();
  }

  buildParams(){
    var attr = this.getAttribute();
    for(var index in attr) {
      if (attr.hasOwnProperty(index)) {
        this.setParam(index, attr[index](index));
      }
    }
  }

  getAttribute(){
    return {
      id:           ()=>{return Config.id}, // website Id
      uid:          ()=>{return Cookie.get('uid')}, // user Id
      ev:           ()=>{return this.event}, // event being triggered
      ed:           ()=>{return this.optinal}, // any event data to pass along
      v:            ()=>{return Config.version}, // openpixel.js version
      dl:           ()=>{return window.location.href}, // document location
      rl:           ()=>{return document.referrer}, // referrer location
      ts:           ()=>{return this.timestamp}, // timestamp when event was triggered
      de:           ()=>{return document.characterSet}, // document encoding
      sr:           ()=>{return window.screen.width + 'x' + window.screen.height}, // screen resolution
      vp:           ()=>{return window.innerWidth + 'x' + window.innerHeight}, // viewport size
      cd:           ()=>{return window.screen.colorDepth}, // color depth
      dt:           ()=>{return document.title}, // document title
      bn:           ()=>{return Browser.nameAndVersion()}, // browser name and version number
      md:           ()=>{return Browser.isMobile()}, // is a mobile device?
      ua:           ()=>{return Browser.userAgent()}, // user agent
      utm_source:   (key)=>{return Cookie.getUtm(key)}, // get the utm source
      utm_medium:   (key)=>{return Cookie.getUtm(key)}, // get the utm medium
      utm_term:     (key)=>{return Cookie.getUtm(key)}, // get the utm term
      utm_content:  (key)=>{return Cookie.getUtm(key)}, // get the utm concent
      utm_campaign: (key)=>{return Cookie.getUtm(key)}, // get the utm campaign
    }
  }

  setParam(key, val){
    if(isset(val)){
      this.params.push(key+'='+val);
    } else {
      this.params.push(key+'=');
    }
  }

  send(){
    window.navigator.sendBeacon ? this.sendBeacon() : this.sendImage();
  }

  sendBeacon(){
    window.navigator.sendBeacon(this.getSourceUrl());
  }

  sendImg(){
    this.img = document.createElement('img');
    this.img.src = this.getSourceUrl();
    this.img.style.display = 'none';
    this.img.width = '1';
    this.img.height = '1';
    document.getElementsByTagName('body')[0].appendChild(this.img);
  }

  getSourceUrl(){
    return pixelEndpoint + '?' + encodeURI(this.params.join('&'));
  }
}
