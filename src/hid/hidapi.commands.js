(function(window, angular) {
    'use strict';

    angular.module('hid')
        .constant('hidCommands', {
            button_ack: '2323005100000000',
            format_storage: '2323000D000000220A204242424242424242424242424242424242424242424242424242424242424242',

            list_wallets:  '2323001000000000',

            scan_wallet:   '2323006100000000',

            // prefixes for commands that take in a variable amount of
            // data, a content size and the payload data is appended
            newWalletPrefix: '23230004',
            restoreWalletPrefix: '23230018',
            renameWalletPrefix: '2323000F',
            signTxPrefix:    '23230065',
            signMessagePrefix: '23230070',
            otpPrefix: '23230057',
            qrPrefix: '23230080',
            setChangePrefix: '23230066',

            // these just get one byte of hex for the wallet number
            // added to them
            deleteWalletPrefix: '232300160000000208',
            loadWalletPrefix: '2323000B0000000208',

            // just a ping
            ping: '2323000000000000',

        });

})(window, window.angular);
