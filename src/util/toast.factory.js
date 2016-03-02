(function(window, angular) {
    'use strict';

    angular.module('app.util')
        .config(ToastConfig)
        .factory('Toast', ToastFactory);

    ToastConfig.$inject = ['ngToastProvider'];

    function ToastConfig(ngToast) {
        ngToast.configure({
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            animation: 'fade'
        });
    }

    ToastFactory.$inject = ['ngToast'];

    function ToastFactory(ngToast) {

        var Toast = function(){};

        var show = Toast.prototype.show = function(params) {
            ngToast.create(params);
        };

        Toast.prototype.clear = function(toast) {
            ngToast.dismiss(toast);
        };

        Toast.prototype.info = function(message) {
            this.show({
                content: message,
                className: 'info'
            });
        };

        Toast.prototype.error = function(message) {
            this.show({
                content: message,
                className: 'danger'
            });
        };

        Toast.prototype.errorHandler = function(err) {
            // this function is unbound, do not use 'this'
            show({
                content: err.message || err,
                className: 'danger'
            });
        };

        Toast.prototype.success = function(message) {
            this.show({
                content: message,
                className: 'success'
            });
        };

        Toast.prototype.warning = function(message) {
            this.show({
                content: message,
                className: 'warning'
            });
        };

        return new Toast();
    }

})(window, window.angular);
