(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .config(disableHistoryApi);

    // Prevent Angular from sniffing for the history API
    // since it's not supported in packaged apps.

    disableHistoryApi.$inject = ['$provide'];

    function disableHistoryApi($provide) {
        $provide.decorator('$window', windowDelegate);
    }

    windowDelegate.$inject = ['$delegate'];

    function windowDelegate($delegate) {
        $delegate.history = null;
        return $delegate;
    }

})(window, window.angular);
