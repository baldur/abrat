(function() {
    var ns = $ABRAT.ns || $ABRAT,
        cookieName = $ABRAT.cookieName || 'abtests',
        experiments = $ABRAT.experiments;

    if(!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }
    // this bit is ripped and duplicated from
    // jquery cookie plugin
    var getCookie = function(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1).replace(/\+/g, ' '));
                    break;
                }
            }
        }
        return cookieValue;
    };

    var setCookie = function(name, value) {
        document.cookie = name + '=' + encodeURIComponent(value);
    };
    // end of jquery cookie plugin ripp

    ns.ab = (function() {
        var decode = function(variants){
            var ret = {};
            if(variants) {
                var splitted = variants.split('-');
                for(var i in splitted) {
                    if(splitted.hasOwnProperty(i)) {
                        ret[splitted[i].slice(0,-1)] = parseInt(splitted[i].slice(-1), 10);
                    }
                }
            }
            return ret;
        };
        var style = "";

        var self = {
            'running_experiments' : decode(experiments),
            'variants' : decode(getCookie(cookieName)),
            'encode' : function(variants) {
                var ret = "";
                for(var i in variants) {
                    if(variants.hasOwnProperty(i)) {
                        ret += i+variants[i]+"-";
                    }
                }
                return ret.slice(0,-1);
            },
            'switcher' : function(split) {
                var random = Math.ceil((Math.random()*10)),
                    ret;
                if(!arguments.length) {
                    split = 5;
                }
                if(split <= random) {
                    ret = 0;
                } else {
                    ret = 1;
                }
                return ret;
            },
            'writeRules' : function(name){
                style += "body."+name+"-a ."+name+"-b { display: none !important }";
                style += "body."+name+"-b ."+name+"-a { display: none !important }";
            },
            'getCSSrules' : function(){
                return document.createTextNode(style);
            },
            'getCssText' : function(){
                return style;
            },
            'report' :  function(){
                return getCookie(cookieName);
            },
            'attachHandlers' : function(func){
                for(var i in variants) {
                    if(variants.hasOwnProperty(i)) {
                        func(i+"-"+ ['a','b'][variants[i]]);
                    }
                }
            }
        };
        return self;
    })();


    for(var i in ns.ab.running_experiments) {
        if(ns.ab.running_experiments.hasOwnProperty(i)) {
            var variant,
                variants = ns.ab.variants;
            if( typeof(variants[i]) !== "undefined" ) {
                variant = ['a','b'][variants[i]];
            } else {
                variant = ['a','b'][ns.ab.switcher(ns.ab.running_experiments[i])];
                variants[i] = ['a','b'].indexOf(variant);
            }
            document.body.className += " " + i + "-" + variant;
            ns.ab.writeRules(i);
        }
    }

    setCookie(cookieName, ns.ab.encode(ns.ab.variants));

    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');

    if (style.styleSheet) { // IE
      style.styleSheet.cssText = ns.ab.getCssText();
    } else {
      style.appendChild(ns.ab.getCSSrules());
    }
    document.getElementsByTagName('head')[0].appendChild(style);
})();

