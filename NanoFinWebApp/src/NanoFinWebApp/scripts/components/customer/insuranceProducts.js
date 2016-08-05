angular.module('myApp')
    .controller('insuranceProd', ['$scope', '$http', function ($scope, $http)
    {
     
        
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
            url: 'http://nanofinapi.azurewebsites.net/api/insuranceManager/Getinsuranceproducts?ProductProviderID=11'
        })
        .then(successCallBack, errorCallBack);



    }]);