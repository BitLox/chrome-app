(function(window, angular) {
    'use strict';

    angular.module('bitcoin')
        .factory('txUtil', txUtilFactory);

    txUtilFactory.$inject = [
        '$q',
        '$http',
    ];

    function txUtilFactory($q, $http) {


        var baseUrl = 'https://bitcoin.toshi.io/api/v0/transactions';

        var txUtil = {
            getHex: getHex,
            submit: submit,
        };

        function getHex(bigEndianTxid) {
            return $http.get(baseUrl + '/' + bigEndianTxid + '.hex').then(function(res) {
                return res.data;
            });
        }

        function submit(signedHex) {
            return $http.post(baseUrl, {
                hex: signedHex
            }).then(function(res) {
                if (res.data.error) {
                    if (res.data.error.indexOf("already spent") >= 0) {
                        return $q.reject(new Error("Some inputs already spent, please try transaction again in a few minutes"));
                    } else {
                        return $q.reject(new Error(res.data.error));
                    }
                }
                return res.data;
            });
        }

        return txUtil;
    }

})(window, window.angular);
