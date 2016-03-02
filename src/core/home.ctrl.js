(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['$timeout', 'hidapi', 'Toast'];

    function HomeCtrl($timeout, hidapi, Toast) {
        var vm = this;

        var checkDevice = vm.checkDevice = function() {
            vm.openingDevice = true;
            hidapi.ping().then(function() {
                hidapi.uuid().then(function(uuid) {
                    vm.uuid = uuid;
                    vm.openingDevice = false;
                }, Toast.errorHandler);
            }, Toast.errorHandler);
        };

        checkDevice();

    }

})(window, window.angular);
