angular.module('myApp')
     .directive('fileInput', ['$parse', function ($parse) {

         return {
             restrict: 'A',
             link: function (scope, element, attrs) {
                 element.bind('change', function () {//on change event bind this element to the model
                     $parse(attrs.fileInput)
                     .assign(scope, element[0].files);
                     scope.$apply();
                 });
             }
         };
     }])
   .controller('addProductController', ['$scope', '$http', function ($scope, $http) {
        var ID;
        var insuranceProdID;
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";

        $scope.apiBaseUrl = 'https://nanofinapifinal.azurewebsites.net';
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
                ipClaimInfoPath: "string",
                claimtemplate_ID: 0
            };


        $scope.submitProductChanges = function ()
        {
            $scope.product.isAvailableForPurchase = document.getElementById("sltAvailable").value;
            var req = {
                method: 'POST',
                url: hostaddress + 'insuranceManager/Postproduct',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: JSON.stringify($scope.product)
            };

            $http(req).then(
                function (responce, status, headers, config)
                {
                    $scope.InsuranceProduct.Product_ID = parseInt(responce.data.Product_ID);
                }
                );
        };

        $scope.submitInsuranceProductChanges = function () 
        {
            
            $scope.InsuranceProduct.InsuranceType_ID = document.getElementById("sltInsuranceType").value;
            $scope.InsuranceProduct.ipUnitType = document.getElementById("sltInsuranceType").value;
            //M Code to assign claim template to the product:
            $scope.InsuranceProduct.claimtemplate_ID = document.getElementById("sltInsuranceType").value;

            var req =
             {
                method: 'POST',
                url: hostaddress + 'insuranceManager/Postinsuranceproduct',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                },
                data: JSON.stringify($scope.InsuranceProduct)
            };
            $http(req).then(
                function (responce) {
                  //  $scope.InsuranceProduct.Product_ID = 262;
                });

        };


        $scope.uploading = false;


        var fd = new FormData();
        $scope.upload = function (files) {
            $scope.uploading = true;


            console.log(files);

            if (files.length === 0) {
                alert("No files selected!");
                $scope.uploading = false;
                return;
            }
            //check file size of all files //and extensions
            for (var i = 0; i < files.length; i++) {
                var fsize = files.item(i).size;//size of file
                console.log('file size:' + fsize);

                if ((fsize / 1024) >= 2048) {
                    $scope.showMaxFileSizeAlert();
                    $scope.uploading = false;
                    return;
                }

                var fileExtension = $scope.getFileExt(files.item(i).name);

                if (fileExtension === 'exe') {
                    alert("Don't allow this file type!");
                    $scope.uploading = false;
                    return;
                }
            }

            angular.forEach(files, function (value, key) {
                fd.append(key, value);
            });
            $http.post($scope.apiBaseUrl + '/api/FileUpload/uploadToNewDirectory?strDirectory=PolicyDocs/', fd,
                {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (d) {
                    $scope.uploading = false;
                    alert("Files uploaded successfully!");
                    console.log(d);
                }).error(function () {
                    $scope.uploading = false;
                    alert("Failed!");
                });

        };

        $scope.getFileExt = function (string) {
            var array = string.split('.');
            return array[1];
        };

        $http(
        {
            method: 'GET',
            url: hostaddress + 'ConsumerProfiles/getConsumerGroups',
        })
        .then(function (responce) {
            $scope.groups = responce.data;
        });
    }]);