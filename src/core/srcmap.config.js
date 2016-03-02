(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .config(['$provide', function($provide) {
            // Fix sourcemaps
            // @url https://github.com/angular/angular.js/issues/5217#issuecomment-50993513
            $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
                return function(exception, cause) {
                    $delegate(exception, cause);
                    setTimeout(function() {
                        throw exception;
                    });
                };
            }]);
       }]);

})(window, window.angular);
