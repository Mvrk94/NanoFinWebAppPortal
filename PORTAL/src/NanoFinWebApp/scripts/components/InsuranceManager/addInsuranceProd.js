var app = angular.module('myApp');


    app.controller('addProductController', ['$scope', '$http', function ($scope, $http) {
        var ID;
        var insuranceProdID;

        $scope.product = {
            Product_ID : 0,
            ProductProvider_ID : 11,
            ProductType_ID : 1,
            productName: "",
            productDescription: "",
            productPolicyDocPath: "c://",
            isAvailableForPurchase: true
        };


        $scope.InsuranceProduct =
            {
                InsuranceProduct_ID: 0,
                ProductProvider_ID: 11,
                InsuranceType_ID: 0,
                Product_ID: 0,
                ipCoverAmount: 0,
                ipUnitCost: 0,
                ipUnitType: 0,
                ipMinimunNoOfUnits: 0,
                ipClaimInfoPath: "string"
            };


        $scope.submitProductChanges = function ()
        {
            $scope.product.isAvailableForPurchase = document.getElementById("sltAvailable").value;
            var req = {
                method: 'POST',
                url: 'http://nanofinapibetabeta.azurewebsites.net/api/insuranceManager/Postproduct',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: JSON.stringify($scope.product)
            };

            $http(req).then(
                function (responce, status, headers, config)
                {
                    $scope.InsuranceProduct.Product_ID = parseInt(String(headers('location')).replace("http://nanofinapibeta.azurewebsites.net/api/insuranceManager/Postproduct/", ""));
                    alert("first item sent");
                }
                );
        };

        $scope.submitInsuranceProductChanges = function () 
        {
            
            $scope.InsuranceProduct.InsuranceType_ID = document.getElementById("sltInsuranceType").value;
            $scope.InsuranceProduct.ipUnitType = document.getElementById("sltInsuranceType").value;
            var req =
             {
                method: 'POST',
                url: 'http://nanofinapibeta.azurewebsites.net/api/insuranceManager/Postinsuranceproduct',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: JSON.stringify($scope.InsuranceProduct)
            };
            $http(req).then(
                function (responce) {
                    alert("second item sent");
                    $scope.InsuranceProduct.Product_ID = 262;
                });

        };

    }]);