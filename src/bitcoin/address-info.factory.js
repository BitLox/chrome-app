(function(window, angular) {
    'use strict';

    angular.module('bitcoin')
        .factory('addressInfo', addressInfoFactory);

    addressInfoFactory.$inject = [
        '$q',
        '$http',
        'hexUtil',
    ];

    function addressInfoFactory($q, $http, hexUtil) {


        var baseUrl = 'https://bitcoin.toshi.io/api/v0/addresses';
        var addressInfo = {};

        addressInfo.getReceived = function(address) {
            return $http.get(baseUrl + '/' + address).then(function(res) {
                return res.data;
            }, function(err) {
                if (err.status === 404) {
                    return {
                        received: 0,
                        balance: 0,
                        unconfirmed_sent: 0,
                        unconfirmed_received: 0,
                        unconfirmed_balance: 0
                    };
                } else {
                    return $q.reject(err.data);
                }
            });
        };

        addressInfo.getUnspent = function(address) {
            return $http.get(baseUrl + '/' + address + '/unspent_outputs').then(function(res) {
                var outs = res.data;
                outs.forEach(function(out) {
                    // make this data just loke blockchain.info's
                    var hash = out.tx_hash_big_endian = out.transaction_hash;
                    out.tx_hash = hexUtil.makeStringSmallEndian(hash);
                    out.value = out.amount;
                    out.script = out.script_hex;
                    out.tx_output_n = out.output_index;
                });
                return outs;
            }, function(err) {
                if (err.status === 404) {
                    return [];
                }
                return $q.reject(err.data);
            });
        };

        addressInfo.getTransactions = function(address) {
            return $http.get(baseUrl + '/' + address + '/transactions').then(function(res) {
                var txs = res.data.transactions;
                txs = txs.concat(res.data.unconfirmed_transactions);
                return txs;
            }, function(err) {
                if (err.status === 404) {
                    return [];
                } else {
                    return $q.reject(err.data);
                }
            });
        };

        return addressInfo;
    }

})(window, window.angular);
