angular.module('myApp')
    .controller('productManagement', ['$scope', '$http', function ($scope, $http)
    {
        var ID;
        var insuranceProdID;
        var VID = location.search.split('vid=')[1];

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
            url: "http://nanofinapifinal.azurewebsites.net/api/insuranceManager/Getproduct/" +  VID,
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
            url: 'http://nanofinapifinal.azurewebsites.net/api/insuranceManager/Getinsuranceproduct?ProductProviderID=11&productID=' + VID,
        })
        .then(IPsuccessCallBack, IPerrorCallBack);

        $scope.submitProductChanges = function ()
        {
            var xhr = new XMLHttpRequest();
            xhr.open("PUT", "http://nanofinapifinal.azurewebsites.net/api/insuranceManager/Putproduct/" + ID, true);
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
            xhr.open("PUT", "http://nanofinapifinal.azurewebsites.net/api/insuranceManager/Putinsuranceproduct?InsuranceProduct_ID=" + insuranceProdID, true);
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


    }]);