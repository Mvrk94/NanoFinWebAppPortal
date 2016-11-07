angular.module('myApp')
    .controller('insuranceProd', ['$scope', '$http', function ($scope, $http)
    {
     
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";
        var errorCallBack = function (response)
        {
      
            $scope.insuranceProductList = response.data;
        };
        
        var successCallBack = function (response)
        {
            $scope.insuranceProductList = response.data;
        };

        $http(
        {
            method: 'GET',
            url: hostaddress + 'insuranceManager/Getinsuranceproducts?ProductProviderID=11'
        })
        .then(successCallBack, errorCallBack);



    }]);