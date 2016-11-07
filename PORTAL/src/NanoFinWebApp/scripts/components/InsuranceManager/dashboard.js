angular.module('myApp')
    .controller('dashboard', ['$scope', '$http', '$log', function ($scope, $http, $log)
    {
        var map;
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";
        var Vmaps;
       
        var BestProductSuccess = function (responce)
        {
            var data = responce.data;
            var currentBest = data[0];
            var currentWorst = data[0];
            var counter = 0;
            var cost = 0;
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

        var successCallBack = function (response)
        {
            var datasets = [];
            var str = "";
            var year = 6;
            var month = 3;
            var data = response.data;
            var counter = 0;

            for (var y in data)
            {
                str = String(data[counter].activeProductItemStartDate).substr(0,10);
                datasets.push({ period: str, licensed: parseFloat(data[counter].sales).toFixed(2) });
                month++;
                counter++;
            }

            $scope.salesToday = parseInt( data[counter-1].sales).toFixed(2);

            var line = new Morris.Line(
                {
                element: 'canvasData',
                resize: true,
                data: datasets,
                xkey: 'period',
                ykeys: ['licensed'],
                labels: ["2Help1 sales"],
                //lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
                // gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                // pointStrokeColors: ["#efefef"],
                // gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10,
                options: {
                    title: {
                        display: true,
                        text: 'Custom Chart Title'
                    }
                }

            });
        };

        var setDashBoardCards = function (responce)
        {
            //$log.info(responce);
            $scope.monthsales = responce.data.monthsales.toMoney();
            $scope.yearSale = responce.data.yearSale.toMoney();
            $scope.numMembers = responce.data.numMembers;
            $scope.claims = responce.data.claims;
        };

        var errorCallBack = function (response) {
            $scope.insuranceProductList = response.data;
        };

        var unprocessedApplications = function (response) {
            $scope.unprocessedApplications = response.data;
        };


        $http(
        {
            method: 'GET',
            url: hostaddress + 'Reports/getDashboard?productProviderID=11'
        }).then(setDashBoardCards, errorCallBack);


        $http(
       {
           method: 'GET',
           url: hostaddress + 'Reports/getBestSellingProduct'
       }).then(BestProductSuccess, errorCallBack);


        $http(
      {
          method: 'GET',
          url: hostaddress + 'ReportsMaster/getCurrentMonthDailySales'
      }).then(successCallBack, errorCallBack);
       

        $http(
     {
         method: 'GET',
         url: hostaddress + 'Reports/getNumberOfUnprocessedApplications?ProviderID=11'
     }).then(unprocessedApplications, errorCallBack);

        

       
        Number.prototype.toMoney = function (decimals, decimal_sep, thousands_sep) {
            var n = this,
            c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
            d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

            t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

            sign = (n < 0) ? '-' : '',

            //extracting the absolute value of the integer part of the number and converting to string
            i = parseInt(n = Math.abs(n).toFixed(c)) + '',

            j = ((j = i.length) > 3) ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
        };


       

       

    }]);
