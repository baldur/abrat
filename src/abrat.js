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
        var encode = function(variants) {
            var ret = "";
            for(var i in variants) {
                if(variants.hasOwnProperty(i)) {
                    ret += i+variants[i]+"-";
                }
            }
            return ret.slice(0,-1);
        };
        var running_experiments = decode(experiments);
        var variants = decode(getCookie(cookieName));
        var switcher = function(split) {
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
        };
        var insertStyles = function(rules) {
            var styleNode = document.createElement('style');
            styleNode.setAttribute('type', 'text/css');

            if (styleNode.styleSheet) { // IE
                styleNode.styleSheet.cssText = rules;
            } else {
                styleNode.appendChild(document.createTextNode(rules));
            }
            document.getElementsByTagName('head')[0].appendChild(styleNode);
        };
        var self = {
            'report' :  function(func){
                var ret = {};
                for(var i in variants) {
                    if(variants.hasOwnProperty(i)) {
                        ret[i] = ['a','b'][variants[i]];
                    }
                }
                return func(ret);
            },
            'attachHandlers' : function(func){
                for(var i in variants) {
                    if(variants.hasOwnProperty(i)) {
                        func(i+"-"+ ['a','b'][variants[i]]);
                    }
                }
            },
            'init' : function(){
                var cssRules = "";
                for(var i in running_experiments) {
                    if(running_experiments.hasOwnProperty(i)) {
                        var variant;
                        if( typeof(variants[i]) !== "undefined" ) {
                            variant = ['a','b'][variants[i]];
                        } else {
                            variant = ['a','b'][switcher(running_experiments[i])];
                            variants[i] = ['a','b'].indexOf(variant);
                        }
                        document.body.className += " " + i + "-" + variant;
                        cssRules += "body."+i+"-a ."+i+"-b { display: none !important }";
                        cssRules += "body."+i+"-b ."+i+"-a { display: none !important }";
                    }
                }
                setCookie(cookieName, encode(variants));
                insertStyles(cssRules);
            }
        };
        return self;
    })();

    ns.ab.init();

})();

