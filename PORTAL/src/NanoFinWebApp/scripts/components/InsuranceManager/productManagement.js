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
    .controller('productManagement', ['$scope', '$http', function ($scope, $http)
    {
        $scope.apiBaseUrl = 'http://nanofinapifinal.azurewebsites.net';
        var ID;
        var insuranceProdID;
        var VID = location.search.split('vid=')[1];
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";

        var PerrorCallBack = function (response) {
            $scope.product = response.data;
        };

        var PsuccessCallBack = function (response)
        {
            $scope.product = response.data;
            document.getElementById("sltAvailable").value = $scope.product.isAvailableForPurchase;
            $scope.pageHeader = $scope.product.productName;
            ID = $scope.product.Product_ID;
        };

        $http(
        {
            method: 'GET',
            url: hostaddress + "insuranceManager/Getproduct/" +  VID,
        })
        .then(PsuccessCallBack, PerrorCallBack);


        var IPerrorCallBack = function (response) {
            $scope.InsuranceProduct = response.data;
        };

        var IPsuccessCallBack = function (response)
        {
            $scope.InsuranceProduct = response.data;
            insuranceProdID = $scope.InsuranceProduct.InsuranceProduct_ID;
           
            document.getElementById("sltInsuranceType").value = $scope.InsuranceProduct.InsuranceType_ID;
            document.getElementById("sltInsuranceType").value = $scope.InsuranceProduct.InsuranceType_ID;
        };

        $http(
        {
            method: 'GET',
            url: hostaddress + 'insuranceManager/Getinsuranceproduct?ProductProviderID=11&productID=' + VID,
        })
        .then(IPsuccessCallBack, IPerrorCallBack);

        $scope.submitProductChanges = function ()
        {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", hostaddress + "insuranceManager/Putproduct/" + ID, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            // send the collected data as JSON
            xhr.send(JSON.stringify($scope.product));

            xhr.onloadend = function ()
            {
                // done
            };
        };

        $scope.submitInsuranceProductChanges = function () {

            var xhr = new XMLHttpRequest();
            xhr.open("PUT", hostaddress + "insuranceManager/Putinsuranceproduct?InsuranceProduct_ID=" + insuranceProdID, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

            // send the collected data as JSON
            xhr.send(JSON.stringify($scope.InsuranceProduct));
            xhr.onloadend = function () {};
        };

        $scope.SendFile = function ()
        {
            var f = document.getElementById('file1').files[0],
            r = new FileReader();
            r.onloadend = function (e)
            {
                var data = e.target.result;
                alert(e.target.fileName);
            };
            alert(e.target.fileName);
            r.readAsBinaryString(f);
        };


        $http(
        {
            method: 'GET',
            url: hostaddress + 'ConsumerProfiles/getConsumerGroups',
        })
        .then(function (responce)
        {
            $scope.groups = responce.data;
        });

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
            $http.post($scope.apiBaseUrl + '/api/FileUpload/uploadToNewDirectory?strDirectory=PolicyDocs/',fd,
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

        }
    ]);