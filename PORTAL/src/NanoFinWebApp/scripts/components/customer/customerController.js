
//var app = angular.module('myApp', []);
//app.controller('myCtrl', function ($scope, $http)
//{
//    $http.get("http://nanofinapi.azurewebsites.net/api/UserHandler/getUser/21")
//        .then(function (response) {
//            $scope.myUser = response.data;

//        })






angular.module('myApp')
    .controller('customerCtrl', ['$scope', '$http', '$log', function ($scope, $http, $log)
    {
        //var errorCallBack = function (response) {
        //    $log.info('ERROR:' + reason);
        //};

        //var successCallBack = function (response) {
        //    $log.info('SUCCESS:' + reason);
        //};


       

            $http({
                method: 'GET',
                url: "http://nanofinapi.azurewebsites.net/api/TestManager/Getinsurancetype"
            }).then(function successCallBack(response)
            {
                $scope.insuranceTypes = response.data;

            }, function errorCallBack() {

                $log.info('ERROR:' +reason); 
            });

     
               
            //http://nanofinapi.azurewebsites.net/api/TestManager/Getinsurancetype
        //http://localhost:10812/api/TestManager/Getinsurancetype
    }]);