(function(window, angular) {
    'use strict';

    angular.module('app.wallet', [
        'hid', 'bitcoin', 'app.util',
        'monospaced.qrcode' // https://github.com/monospaced/angular-qrcode
    ]);

})(window, window.angular);
