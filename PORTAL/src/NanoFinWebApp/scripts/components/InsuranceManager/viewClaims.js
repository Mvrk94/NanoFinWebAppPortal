/// <reference path="../../../wwwroot/assets/plugins/datatables/jquery.datatables.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/datatables/jquery.datatables.js" />


angular.module('myApp')
    .filter('payedYesOrNo', function () {
        return function (x)
        {
            if (x === "false")
            {
                return "No";
            }
            if (x === "true")
            {
                return "Yes";
            }

        };

    })
    .controller('viewClaimsCtrl', ['$scope', '$http', '$compile', '$window', '$log', function ($scope, $http, $compile, $window, $log) {

        $scope.downloadFile = function () {
            window.open('http://localhost:14198/api/FileUpload/GetTestFile', '_blank', '');
        };
        $scope.test = "test";
        $scope.searchClaim = '';

        $scope.sort = function (keyname) {
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
        };
        //$(function () {
        //    $(".clickable-row").click(function () {
        //        window.location = $(this).data("href");
        //    });
        //});

       

        var getClaimsToBeProcessed = function () {
            var specificProductDetails;


            $http({
                method: 'GET',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/viewClaimsToBeProcessed'
            })
              .then(function (response) {
                  var vClaimsToBeProcessed = response.data;
                  $scope.ClaimsToBeProcessed = vClaimsToBeProcessed;

                  
                  $log.info(response);

              }, function (reason) {
                  $log.info(reason);
              });
        };

        getClaimsToBeProcessed();

       
        function redirectToProcessClaimPage(activProdID) {
            $window.location.href = '/processClaim?cid=' + activProdID;
        }

    }]);
