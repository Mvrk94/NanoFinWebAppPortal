angular.module('myApp')
    .controller('viewInsuranceProducts', ['$scope', '$http', function ($scope, $http) {

        var productTypes = [
                  
                       "Asset",
                       "Travel",
                       "Legal",
                      "Medical",
                      "Funeral"
        ];

        var errorCallBack = function (response) {

            $scope.insuranceProductList = response.data;
        };

        var displayToDiv = function (boxColor, name, typeOfInsurance, icon, id)
        {
            var r = "";
           
                r += "div class='col-lg-3 col-xs-6'>";
                r += "<!-- small box -->"
                r += "<div class='"+boxColor +"'>";
                r += "<div class='inner'>";
                r += "<h4><strong>"+name+"</strong></h4>";
                r += "<p>"+typeOfInsurance+"</p>";
                r += "</div>";
                r += "<div class='icon'>";
                r += "<i class='fa "+icon+"'></i>";
                r += "</div>";
                r += "<a href='/ProductManagement?vid="+id+"' class='small-box-footer'>";
                r += "More info <i class='fa fa-arrow-circle-right'></i>";
                r += "</a>";
                r += "</div>";
                r += "</div>";
           
        };


        var successCallBack = function (response)
        {
            $scope.insuranceProductList = response.data;
 

            var Asset = [];
            var Travel = [];
            var Legal = [];
            var Medical = [];
            var Funeral = [];
            var ValueAdded = [];
            data = response.data;

            for (var c = 0 ; c < data.length ; c++ )
            {
                if (response.data[c].typeOfInsurance == "Asset")
                {
                    Asset.push(data[c])
                }

                if (response.data[c].typeOfInsurance == "Travel")
                {
                    Travel.push(data[c])
                }

                if (response.data[c].typeOfInsurance == "Legal")
                {
                    Legal.push(data[c])
                }

                if (response.data[c].typeOfInsurance == "Medical")
                {
                    Medical.push(data[c])
                }

                if (response.data[c].typeOfInsurance == "Funeral")
                {
                    Funeral.push(data[c])
                }

                if (response.data[c].typeOfInsurance == "Value Added Services")
                {
                    ValueAdded.push(data[c])
                }
            }

            $scope.Asset = Asset;
            $scope.Travel = Travel;
            $scope.Legal = Legal;
            $scope.Medical = Medical;
            $scope.Funeral = Funeral;
            $scope.valueAdded = ValueAdded;
        };

        $http(
        {
            method: 'GET',
            url: 'http://nanofinapi.azurewebsites.net/api/insuranceManager/Getinsuranceproducts?ProductProviderID=11'
        })
        .then(successCallBack, errorCallBack);
    }]);