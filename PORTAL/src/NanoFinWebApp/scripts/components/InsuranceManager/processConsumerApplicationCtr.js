angular.module('myApp')
    .controller('processConsumerApplicationCtr', ['$scope', '$http', function ($scope, $http) {
        var ID;
        var insuranceProdID;
        var CID = location.search.split('cid=')[1];
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";

        var PerrorCallBack = function (response)
        {
            $scope.user = response.data;
        };

        var PsuccessCallBack = function (response)
        {
            $scope.user = response.data;
            
            $scope.pageHeader =  $scope.user.clientName;
            $scope.location = $scope.user.residentTown;

            $scope.ageGroupValue = getAgeCat(getGroup($scope.user.age));
            $http(
            {
                method: 'POST',
                url: hostaddress + "ProcessInsuranceApplications/getConsummerUnProccessedPurchases?idConsumer=" + CID,
            })
            .then(purchaseCallBack, PerrorCallBack);
        };

        $http(
        {
            method: 'POST',
            url: hostaddress + "ProcessInsuranceApplications/getUserInformation?idConsumer=" + CID,
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
                html += "<p>Purchased " + unprocessedList[counter].datum + "</p>";
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
                url: hostaddress + "ProcessInsuranceApplications/processApplicationNativeImp?activeProductID=" + activeProdID,
            }).then(function(responce)
            {
                if(responce.data === true)
                    $http(
                   {
                       method: 'POST',
                       url: hostaddress + "ProcessInsuranceApplications/getConsummerUnProccessedPurchases?idConsumer=" + CID,
                   })
                   .then(purchaseCallBack, PerrorCallBack);
            });


           
        }

        function DeclineProduct(event)
        {
            var activeProdID = String(this.id).replace("btGrant", "");
            $http(
            {
                method: 'POST',
                url: "ProcessInsuranceApplications/RejectedApplication?ActiveProductID=" + activeProdID,
            });


            $http(
            {
                method: 'POST',
                url: "ProcessInsuranceApplications/getConsummerUnProccessedPurchases?idConsumer=" + CID,
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

        function getGroup(age)
        {
            if ( age <= 25)
                return 2;
            else if (age <=30)
                return 12;
            else if (age <= 49)
                return 22;
            else if (age <= 60)
                return 32;
        }
    }]);