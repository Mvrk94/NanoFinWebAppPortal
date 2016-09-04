angular.module('myApp')
    .controller('resellerCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log) {
        //$log.info(object or str)
        var errorCallBack = function (response) {
            $log.info('ERROR:' + reason);
        };

        var successCallBack = function (response) {
            $log.info('SUCCESS:' + reason);
        };
         
        $scope.buyBulk = function (amount, resellerID) {
            //change url to hosted nanofin web api - also need to be able to get userID as well as resellerID
            $http({
                method: 'POST',
                url: 'http://localhost:10812/api/WalletHandler/buyBulkVoucher?userID=33&resellerID=1&BulkVoucherAmount=' + amount + '&transactionType_ID=1'
            })
            .then(successCallBack, errorCallBack);
        };
        //recipient details can be - email, cellphone number, username.
        $scope.sendBulkVoucher = function (amount, resellerUserID, recipienDetails) {
            $http({
                method: 'POST',
                url: 'http://localhost:10812/api/WalletHandler/sendBulkVoucher?resellerUserID=' + resellerUserID + '&recipientDetails=' + recipienDetails + '&transferAmount=' + amount
            })
            .then(successCallBack, errorCallBack);  
        };

    }]);
