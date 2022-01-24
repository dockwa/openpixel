class Cookie {
    static prefix() {
        return  `__${pixelFuncName}_`;
    }

    static set(name, value, minutes) {
        var now = new Date()
        var ttl = minutes * 60 * 1000;
        var item = {
            value: value,
            expiry: now.getTime() + ttl,
        }
        localStorage.setItem(`${this.prefix()}${name}`, JSON.stringify(item))
    }

    static get(name) {
        var name = `${this.prefix()}${name}`;
        var itemStr = localStorage.getItem(name)
        if (!itemStr) {
            return null
        }
        try {
            var item = JSON.parse(itemStr)
        } catch(e) { //not a json backward compatiblity
            localStorage.removeItem(name)
            return null
        }
        const now = new Date()
        if (now.getTime() > item.expiry) {
            localStorage.removeItem(name)
            return null
        }
        return item.value
    }

    static delete(name) {
        this.set(name,'',-100);
    }

    static exists(name) {
        return Helper.isPresent(this.get(name));
    }

    static setUtms() {
        var utmArray = ['utm_source', 'utm_medium', 'utm_term', 'utm_content', 'utm_campaign'];
        var exists = false;
        for (var i = 0, l = utmArray.length; i < l; i++) {
            if (Helper.isPresent(Url.getParameterByName(utmArray[i]))) {
                exists = true;
                break;
            }
        }
        if (exists) {
            var val, save = {};
            for (var i = 0, l = utmArray.length; i < l; i++) {
                val = Url.getParameterByName(utmArray[i]);
                if (Helper.isPresent(val)) {
                    save[utmArray[i]] = val;
                }
            }
            this.set('utm', JSON.stringify(save));
        }
    }

    static getUtm(name) {
        if (this.exists('utm')) {
            var utms = JSON.parse(this.get('utm'));
            return name in utms ? utms[name] : '';
        }
    }
}
