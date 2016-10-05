angular.module('myApp')
    .controller('processConsumerApplicationCtr', ['$scope', '$http', function ($scope, $http) {
        var ID;
        var insuranceProdID;
        var CID = location.search.split('cid=')[1];

        var PerrorCallBack = function (response)
        {
            $scope.user = response.data;
        };

        var PsuccessCallBack = function (response)
        {
            $scope.user = response.data[0];
            
            $scope.pageHeader = "#" + $scope.user.idConsumer + " " + $scope.user.userFirstName + " " + $scope.user.userLastName;
            $scope.location = $scope.user.City + ", " + $scope.user.Province;

            $http(
            {
                method: 'POST',
                url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/getConsummerUnProccessedPurchases?ConsumerID=" + CID,
            })
            .then(purchaseCallBack, PerrorCallBack);
        };

        $http(
        {
            method: 'POST',
            url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/getUserInformation?idConsumer=" + CID,
        })
        .then(PsuccessCallBack, PerrorCallBack);


        function  purchaseCallBack(responce)
        {
            var unprocessedList = responce.data;
            var counter = 0;
            var html = "";
            for (var p in unprocessedList)
            {
                html += "<div class='col-lg-6 col-xs-6'>";
                html += "<div class='small-box bg-blue'>";
                html += "";
                html += "<div class='inner'>";
                html += "<h4>"+ unprocessedList[counter].productName +"</h4>";
                html += "";
                html += "<p>purchased " + unprocessedList[counter].datum + "</p>";
                html += "<span class='pull-left'>";
                html += "<button type='button' class='btn btn-success' id='btGrant" + unprocessedList[counter].ActiveProductItems_ID + "'>Grant</button>";
                html += "</span>";
                html += "<span class='pull-right'>";
                html += "<button type='button' class='btn btn-danger'id='btnDecline" + unprocessedList[counter].ActiveProductItems_ID + "'>Decline</button>";
                html += "</span>";
                html += "<br />";
                html += "<br />";
                html += "</div>";
                html += "</div>";
                html += "</div>";
                counter++;
            }



            document.getElementById("unprocessedProds").innerHTML = html;

            counter = 0;
            for (var g in unprocessedList)
            {
                document.getElementById("btGrant" + unprocessedList[counter].ActiveProductItems_ID).onclick = GrantProduct;
                counter++;
            }

            counter = 0;
            for (var r in unprocessedList) {
                document.getElementById("btnDecline" + unprocessedList[counter].ActiveProductItems_ID).onclick = GrantProduct;
                counter++;
            }
            
        }

        function GrantProduct(event)
        {
            var activeProdID = String(this.id).replace("btGrant", "");
            $http(
            {
                method: 'POST',
                url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/ProcessSingleApplication?activeProductID=" + activeProdID,
            });


            $http(
            {
                method: 'POST',
                url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/getConsummerUnProccessedPurchases?ConsumerID=" + CID,
            })
            .then(purchaseCallBack, PerrorCallBack);
        }

        function DeclineProduct(event)
        {
            var activeProdID = String(this.id).replace("btGrant", "");
            $http(
            {
                method: 'POST',
                url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/RejectedApplication?ActiveProductID=" + activeProdID,
            });


            $http(
            {
                method: 'POST',
                url: "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/getConsummerUnProccessedPurchases?ConsumerID=" + CID,
            })
            .then(purchaseCallBack, PerrorCallBack);
        }


        function getAgeCat(id)
        {
            if (2 == id)
                return "18-25";
            else if (12 == id)
                return "26-30";
            else if (22 == id)
                return "31-49";
            else if (32 == id)
                return "40-60";
        }
    }]);