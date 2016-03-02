(function(window, angular, BigNumber) {
    'use strict';

    angular.module('bitcoin')
        .directive('bcUnitSelector', bcUnitSelector);

    bcUnitSelector.$inject = ['$rootScope', 'COIN', 'Cookie'];

    var COOKIE_NAME = 'bitlox-denom';

    function bcUnitSelector($rootScope, COIN, Cookie) {
        return {
            scope: true,
            restrict: 'E',
            replace: true,
            templateUrl: 'bitcoin/unit-selector.html',
            link: function(scope) {
                var bitcoin = new BigNumber(COIN);
                var milly = bitcoin.dividedBy(1000);
                var bit = bitcoin.dividedBy(1000000);

                scope.options = {
                    BTC: bitcoin,
                    mBTC: milly,
                    bits: bit
                };

                scope.changeCurrency = function(denom, value) {
                    scope.current = value;
                };


                scope.$watch('current', function() {
                    if (scope.current) {
                        $rootScope.denomination = scope.current;
                        if (scope.current.equals(scope.options.BTC)) {
                            $rootScope.currency = 'BTC';
                        } else if (scope.current.equals(scope.options.mBTC)) {
                            $rootScope.currency = 'mBTC';
                        } else if (scope.current.equals(scope.options.bits)) {
                            $rootScope.currency = 'bits';
                        }
                        scope.currentDisplay = $rootScope.currency;
                        Cookie.set(COOKIE_NAME, $rootScope.currency);
                    }
                });

                Cookie.get(COOKIE_NAME, function(err, cookieVal) {
                    scope.$apply(function() {
                        if (cookieVal) {
                            scope.current = scope.options[cookieVal];
                        } else {
                            scope.current = bitcoin;
                        }
                    });
                });

            }
        };
    }

})(window, window.angular, window.BigNumber);
