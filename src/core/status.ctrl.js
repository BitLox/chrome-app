(function(window, angular) {
    'use strict';

    angular.module('app.core')
        .controller('StatusCtrl', StatusCtrl);

    StatusCtrl.$inject = ['hidapi', 'WalletStatus'];

    function StatusCtrl(hidapi, WalletStatus) {
        var vm = this;

        vm.bitlox = {
            connectAttempted: false,
            connected: true,
            status: "No Bitlox",
            alertClass: "danger"
        };

        vm.wallet = {
            status: "No Wallet",
            alertClass: "warning"
        };

        vm.refreshBitlox = function() {
            hidapi.ping();
        };

        hidapi.$scope.$watch('status', function(hidstatus) {
            switch(hidstatus) {
            case hidapi.STATUS_CONNECTED:
                vm.bitlox.connectAttempted = true;
                vm.bitlox.connected = true;
                vm.bitlox.status = "Bitlox connected";
                vm.bitlox.alertClass = "success";
                vm.bitlox.glyph = "glyphicon-ok";
                break;
            case hidapi.STATUS_CONNECTING:
                vm.bitlox.connectAttempted = true;
                vm.bitlox.status = "Bitlox connecting";
                vm.bitlox.alertClass = "success";
                vm.bitlox.glyph = "glyphicon-refresh";
                break;
            case hidapi.STATUS_DISCONNECTED:
                console.warn("DISCONNECTED");
                vm.bitlox.connected = false;
                vm.bitlox.status = "Bitlox disconnected!";
                vm.bitlox.alertClass = "danger";
                vm.bitlox.glyph = "glyphicon-remove";
                break;
            case hidapi.STATUS_WRITING:
                vm.bitlox.connectAttempted = true;
                vm.bitlox.connected = true;
                vm.bitlox.status = "Bitlox writing";
                vm.bitlox.alertClass = "info";
                vm.bitlox.glyph = "glyphicon-upload";
                break;
            case hidapi.STATUS_READING:
                vm.bitlox.connectAttempted = true;
                vm.bitlox.connected = true;
                vm.bitlox.status = "Bitlox reading";
                vm.bitlox.alertClass = "info";
                vm.bitlox.glyph = "glyphicon-download";
                break;
            default:
                vm.bitlox.connected = false;
                vm.bitlox.status = null;
            }
        });

        WalletStatus.$watch('status', function(walletstatus) {
            switch(walletstatus) {
            case WalletStatus.STATUS_LOADING:
                vm.wallet.status = "Loading wallet";
                vm.wallet.alertClass = "info";
                vm.wallet.glyph = "glyphicon-download";
                break;
            case WalletStatus.STATUS_LOADING_UNSPENT:
                vm.wallet.status = "Finding unspent outputs";
                vm.wallet.alertClass = "info";
                vm.wallet.glyph = "glyphicon-cloud-download";
                break;
            case WalletStatus.STATUS_LOADING_TRANSACTIONS:
                vm.wallet.status = "Finding transactions";
                vm.wallet.alertClass = "info";
                vm.wallet.glyph = "glyphicon-cloud-download";
                break;
            case WalletStatus.STATUS_SENDING:
                vm.wallet.status = "Wallet sending";
                vm.wallet.alertClass = "info";
                vm.wallet.glyph = "glyphicon-log-out";
                break;
            case WalletStatus.STATUS_SIGNING:
                vm.wallet.status = "Wallet signing";
                vm.wallet.alertClass = "info";
                vm.wallet.glyph = "glyphicon-pencil";
                break;
            default:
                vm.wallet.status = null;
            }
        });


    }

})(window, window.angular);
