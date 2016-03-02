(function(window, angular) {
    'use strict';

    angular.module('app', [
        'ui.bootstrap',
        'app.core', 'app.wallet'
    ]).config(appConfig);

    appConfig.$inject = ['$compileProvider'];

    function appConfig ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|bitcoin):/);
    }

})(window, window.angular);
