(function(window, angular) {
    'use strict';

    angular.module('app.wallet')
        .directive('walletInfo', walletInfo);

    walletInfo.$inject = ['Toast'];

    function walletInfo(Toast) {
        return {
            scope: {
                wallet: '=',
                onDelete: '&',
                expertMode: '=',
            },
            templateUrl: 'wallet/info.html',
            link: function(scope) {
                scope.refreshBalance = function() {
                    scope.refreshingBalance = true;
                    scope.wallet.updateBalance().catch(Toast.errorHandler)
                        .finally(function() {
                            scope.refreshingBalance = false;
                        });
                };

                scope.refreshTransactions = function() {
                    scope.refreshingTransactions = true;
                    scope.wallet.loadTransactions().catch(Toast.errorHandler)
                        .finally(function() {
                            scope.refreshingTransactions = false;
                        });
                };

                scope.$watchCollection('wallet', function(v) {
                    if (v && v.balance !== undefined) {
                        scope.wallet.balance = v.balance;
                    }
                });
            }
        };
    }

})(window, window.angular);
