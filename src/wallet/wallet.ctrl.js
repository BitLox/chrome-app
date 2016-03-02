(function(window, angular, chrome) {
    'use strict';

    angular.module('app.wallet')
        .controller('WalletCtrl', WalletCtrl);

    WalletCtrl.$inject = ['$timeout', 'MAX_WALLETS', 'Wallet', 'Toast', 'hidapi'];

    function WalletCtrl($timeout, MAX_WALLETS, Wallet, Toast, hidapi) {
        var vm = this;

        chrome.hid.onDeviceAdded.addListener(function() {
            vm.readWallets();
        });

        vm.readWallets = function() {
            vm.readingWallets = true;
            return Wallet.list()
                .then(function(wallets) {
                    vm.wallets = wallets;
                    vm.openWallet = null;
                    refreshAvailableNumbers(wallets);
                }, Toast.errorHandler)
                .finally(function() {
                    vm.readingWallets = false;
                });
        };

        vm.loadWallet = function(wallet) {
            vm.openWallet = null;
            vm.loadingXpub = true;
            console.debug("loading wallet", wallet.number);
            vm.openingWallet = wallet.number;
            wallet.open()
                .then(function() {
                    vm.openWallet = wallet;
                }, Toast.errorHandler, function(status) {
                    console.debug("open notify", status);
                    if (status === Wallet.NOTIFY_XPUB_LOADED) {
                        vm.loadingXpub = false;
                    }
                })
                .finally(function() {
                    console.debug("done loading wallet", wallet.number);
                    vm.openingWallet = -99;
                });
        };

        vm.refreshBalance = function() {
            vm.refreshingBalance = true;
            vm.openWallet.updateBalance().catch(Toast.errorHandler)
                .finally(function() {
                    vm.refreshingBalance = false;
                });
        };

        vm.directOpenNumber = 0;
        vm.directLoad = function() {
            var wallet;
            vm.wallets.forEach(function(w) {
                if (w.number === vm.directOpenNumber) {
                    wallet = w;
                }
            });
            if (!wallet) {
                wallet = new Wallet({
                    wallet_number: vm.directOpenNumber,
                    version: 4,
                    wallet_name: "HIDDEN",
                    wallet_uuid: "HIDDEN",
                });
            }
            vm.loadWallet(wallet);
        };

        vm.prepForFlash = function() {
            vm.flashing = true;
            hidapi.flash().catch(Toast.errorHandler)
                .finally(function() {
                    vm.flashing = false;
                });
        };



        reset();

        function refreshAvailableNumbers(wallets) {
            if (!wallets) {
                return;
            }
            // assemble array of wallet numbers
            var available = [];
            for(var i = 0; i < (MAX_WALLETS + 1); i++) {
                available.push(i);
            }
            // now loop through the wallets and remove existing
            // numbers
            wallets.forEach(function(wallet) {
                available.splice(available.indexOf(wallet.number), 1);
            });
            // set to the vm for the new wallet form
            vm.availableWalletNumbers = available;
        }

        function reset() {
            // status variables
            vm.readingWallets = true;
            vm.openingWallet = -99;
            vm.scanningWallet = false;
            vm.creatingWallet = false;
            vm.refreshingBalance = false;
            vm.openWallet = null;
            // read after a timeout, so angular does not hang and show
            // garbage while the browser is locked form readin the device
            // $timeout(vm.readWallets.bind(vm));
            console.debug('FOO');
            vm.readWallets();
        }

    }

})(window, window.angular, window.chrome);
