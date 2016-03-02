(function(window, chrome) {
    'use strict';

    chrome.app.runtime.onLaunched.addListener(function() {
        chrome.app.window.create('index.html', {
            outerBounds: {
                width: 1080,
                height: 700
            }
        });
    });

})(window, window.chrome);
