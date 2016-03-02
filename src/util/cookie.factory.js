(function(window, angular, chrome) {
    'use strict';

    angular.module('app.util')
        .factory('Cookie', CookieFactory);

    CookieFactory.$inject = [];


    function CookieFactory() {
        var Cookie = {};

        Cookie.set = function(key, value, cb) {
            if (cb === undefined) {
                cb = function(err) {
                    if (err) {
                        console.error(err);
                    }
                };
            }
            var setObj = {};
            setObj[key] = value;
            console.debug('setting "cookie"', key, "to", value);
            chrome.storage.sync.set(setObj, function() {
                if (chrome.runtime.lastError) {
                    return cb(chrome.runtime.lastError);
                }
                console.debug('set', key, "to", value);
            });
        };

        Cookie.get = function(key, cb) {
            console.debug('getting "cookie"', key);
            chrome.storage.sync.get(key, function(data) {
                if (chrome.runtime.lastError) {
                    return cb(chrome.runtime.lastError);
                }
                console.debug('got', key, "=", data[key]);
                return cb(undefined, data[key]);
            });
        };

        Cookie.remove = function(key) {
            chrome.storage.sync.remove(key);
        };

        return Cookie;
    }

})(window, window.angular, window.chrome);
