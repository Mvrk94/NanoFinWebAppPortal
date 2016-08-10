angular.module('myApp')
    .controller('dashboard', ['$scope', '$http', function ($scope, $http) 
    {
        var map;

        var Vmaps;
       
        var BestProductSuccess = function (responce)
        {
            var data = responce.data;
            var currentBest = data[0];
            var currentWorst = data[0];
            var counter = 0;
            for (var p in data)
            {
                if (parseInt(responce.data[counter].overallUsage) > parseInt(currentBest.overallUsage))
                {

                   currentBest = data[counter];
                }
                else if (parseInt(responce.data[counter].overallUsage) < parseInt(currentWorst.overallUsage))
                {
                    
                    currentWorst = data[counter];
                }
                counter++;
            }
            $scope.bestProduct = currentBest;
            $scope.worstProduct = currentWorst;
        };

        var getSales = function (response)
        {
            $scope.numOverallSales = response.data.numOverallSales;
            $scope.mySales = response.data.mySales;
            $scope.MarketShare = ($scope.mySales * 100) / $scope.numOverallSales;
        };

        var getMemeber = function (responce) {
            $scope.memebers = responce.data;
        };

        //var setAreaRatings = function (responce) {
        //    var bestArea = responce.data[0];
        //    var worstArea = responce.data[0];

           
        //    var counter = 0;
        //    var data = responce.data;
        //    for (var p in data) {
        //        if (parseInt(data[counter].voucherSent) > parseInt(bestArea.voucherSent))
        //        {
        //            bestArea = responce.data[counter];
        //        }
        //        else if (parseInt(data[counter].voucherSent) < parseInt(worstArea.voucherSent))
        //        {
        //            worstArea = responce.data[counter];
        //        }
        //        counter++;
        //    }
        //    $scope.bestArea.address = String(bestArea.address).split(':')[2];
        //    $scope.worstArea.address = String(worstArea.address).split(':')[2];
        //};

        var successCallBack = function (response)
        {
            $scope.insuranceProductList = response.data;
            var mapMarkers = [];
            var details = response.data;
            var counter = 0;
            for (var p in details) {
                var value = 'vouchers' + String(response.data[counter].voucherSent) + 'sent at' + response.data[counter].address.split(':')[2];
                mapMarkers.push(
                    {
                        latLng: [parseFloat(response.data[counter].address.split(':')[0]), parseFloat(response.data[counter].address.split(':')[1])],
                        name: value
                    });
                counter++;
            }

            Vmaps = $('#world-map-markers').vectorMap(
            {
                map: 'world_mill_en',
                normalizeFunction: 'polynomial',
                hoverOpacity: 0.7,
                hoverColor: false,
                zoomMin: 1,
                backgroundColor: 'transparent',
                regionStyle:
                {
                    initial:
                    {
                        fill: 'rgba(210, 214, 222, 1)',
                        "fill-opacity": 1,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 1
                    },
                    hover:
                    {
                        "fill-opacity": 0.7,
                        cursor: 'pointer'
                    },
                    selected:
                    {
                        fill: 'yellow'
                    },
                    selectedHover: {}
                },
                markerStyle:
                {
                    initial:
                    {
                        fill: '#00a65a',
                        stroke: '#111'
                    }
                },
                markers: mapMarkers
            });
            var bestArea = response.data[0];
            var worstArea = response.data[0];


            counter = 0;
            for (var v in response.data)
            {
                if (parseInt(response.data[counter].voucherSent) > parseInt(bestArea.voucherSent)) {
                    bestArea = response.data[counter];
                }
                else if (parseInt(response.data[counter].voucherSent) < parseInt(worstArea.voucherSent)) {
                    worstArea = response.data[counter];
                }
                counter++;
            }
            $scope.bestArea = bestArea;
            $scope.worstArea = worstArea;
            $scope.bestArea.address = String(bestArea.address).split(':')[2];
            $scope.worstArea.address = String(worstArea.address).split(':')[2];
        };

        var getUnprocessedApplications = function (responce) {
            $scope.unprocessedApplications = responce.data;
        };

        var errorCallBack = function (response) {
            $scope.insuranceProductList = response.data;
        };

       


        $http(
       {
           method: 'GET',
           url: 'http://nanofinapi.azurewebsites.net/api/Reports/getBestSellingProduct'
       }).then(BestProductSuccess,errorCallBack);
        
        $http(
     {
         method: 'GET',
         url: 'http://nanofinapi.azurewebsites.net/api/Reports/getBestReseller'
     })
     .then(successCallBack, errorCallBack);


        $http(
       {
           method: 'GET',
           url: 'http://nanofinapi.azurewebsites.net/api/Reports/getMembers?ProviderID=11'
       }).then(getMemeber, errorCallBack);

        
       $http(
       {
           method: 'GET',
           url: 'http://nanofinapi.azurewebsites.net/api/Reports/getOverallPurchases?Provider_ID=11'
       }).then(getSales, errorCallBack);


       $http(
      {
          method: 'GET',
          url: 'http://nanofinapi.azurewebsites.net/api/Reports/getNumberOfUnprocessedApplications?ProviderID=11'
      }).then(getUnprocessedApplications, errorCallBack);

       

       

    }]);
