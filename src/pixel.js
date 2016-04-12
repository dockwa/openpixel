class Pixel {
  constructor(event){
    this.params = [];
    this.event = event;
    this.attr = {
      id:           'getId',
      uid:          'getUserId',
      ev:           'getEvent',
      v:            'getVerion',
      dl:           'getDocumentLocation',
      rl:           'getReferrerLocation',
      ts:           'getTimestamp',
      de:           'getDocumentEncoding',
      sr:           'getScreenResolution',
      vp:           'getViewport',
      cd:           'getColorDepth',
      dt:           'getDocumentTitle',
      bn:           'getBrowserName',
      md:           'getMobileDevice',
      ua:           'getUserAgent',
      utm_source:   'getUtmSource',
      utm_medium:   'getUtmMedium',
      utm_term:     'getUtmTerm',
      utm_content:  'getUtmContent',
      utm_campaign: 'getUtmCampaign',
    };
    this.buildParams();
    this.send();
  }

  buildParams(){
    for(var index in this.attr) {
      if (this.attr.hasOwnProperty(index)) {
        this.setParam(index, this[this.attr[index]](index));
      }
    }
  }

  getId(){
    return Config.id;
  }

  getUserId(){
    return Cookie.get('uid');
  }

  getEvent(){
    return this.event;
  }

  getVerion(){
    return Config.version;
  }

  getDocumentLocation(){
    return window.location.href;
  }

  getReferrerLocation(){
    return document.referrer;
  }

  getTimestamp(){
    return pixelFunc.t;
  }

  getDocumentEncoding(){
    return document.characterSet;
  }

  getScreenResolution(){
    return window.screen.width + 'x' + window.screen.height;
  }

  getViewport(){
    return window.innerWidth + 'x' + window.innerHeight;
  }

  getColorDepth(){
    return window.screen.colorDepth;
  }

  getDocumentTitle(){
    return document.title;
  }

  getBrowserName(){
    return Browser.nameAndVersion();
  }

  getMobileDevice(){
    return Browser.isMobile();
  }

  getUserAgent(){
    return Browser.userAgent();
  }

  getUtmSource(key){
    return Url.getParameterByName(key);
  }
  getUtmMedium(key){
    return Url.getParameterByName(key);
  }
  getUtmTerm(key){
    return Url.getParameterByName(key);
  }
  getUtmContent(key){
    return Url.getParameterByName(key);
  }
  getUtmCampaign(key){
    return Url.getParameterByName(key);
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
