(function(window, angular) {
    'use strict';

    angular.module('bitcoin')
        .factory('txUtil', txUtilFactory);

    txUtilFactory.$inject = [
        '$q',
        '$http',
        'hexUtil',
    ];

    function txUtilFactory($q, $http) {

        var baseUrl = 'https://bitlox.io/api';
//         var baseUrl = '/api';

        var txUtil = {
            getHex: getHex,
            submit: submit,
        };

        function getHex(bigEndianTxid) {
        	console.debug("raw source txid ", bigEndianTxid);
            return $http.get(baseUrl + '/rawtx/' + bigEndianTxid ).then(function(res) {
            	console.debug("raw source tx ", res.data.rawtx);
                return res.data.rawtx;
            });
        }

        function submit(signedHex) {
        	console.debug("raw signed tx ", signedHex);
            return $http.post(baseUrl + '/tx/send', {
                rawtx: signedHex
            }).then(function(res) {
                if (res.data.error) {
                	console.debug("tx error ", res.data.error);
                    if (res.data.error.indexOf("already spent") >= 0) {
                        return $q.reject(new Error("Some inputs already spent, please try transaction again in a few minutes"));
                    } else {
                        return $q.reject(new Error(res.data.error));
                    }
                }
//                 console.debug("tx good ", JSON.stringify(res.data));
                return res.data;
            });
        }

        return txUtil;
    }

})(window, window.angular);
