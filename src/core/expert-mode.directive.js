(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .directive('expertMode', expertMode);

    expertMode.$inject = ['$rootScope', 'Cookie'];

    var COOKIE_NAME = 'bitlox-expert';

    function expertMode($rootScope, Cookie) {
        return {
            scope: true,
            restrict: 'E',
            templateUrl: 'core/expert-mode.html',
            replace: true,
            link: function(scope) {

                scope.status = "Activate Expert Mode";
                scope.$watch('current', function() {
                    $rootScope.expertMode = scope.current;
                    scope.status = scope.current ? "Expert Mode Active" : "Activate Expert Mode";
                    Cookie.set(COOKIE_NAME, $rootScope.expertMode);
                });

                Cookie.get(COOKIE_NAME, function(err, cookieVal) {
                    scope.$apply(function() {
                        if (cookieVal) {
                            scope.current = cookieVal ? true : false;
                        } else {
                            scope.current = false;
                        }
                    });
                });

            }
        };
    }

})(window, window.angular);
