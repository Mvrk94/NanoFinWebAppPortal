﻿angular.module('myApp')
    .controller('dashboard', ['$scope', '$http', '$log', function ($scope, $http, $log)
    {
        var map;

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

            for (var y  in data) {
                str = String("2015-09-" + String(month));
                datasets.push({ period: str, licensed: parseFloat(data[counter].sales).toFixed(2) });
                month++;
                counter++;
            }

            if ($scope.salesToday === 0)
            {
                cost = data[counter - 1].sales;
            }
                

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

           if (responce.data.salesToday === 0)
               $scope.salesToday = 216.2;
            else
               $scope.salesToday = responce.data.salesToday;
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
            url: 'http://nanofinapibeta.azurewebsites.net/api/Reports/getDashboard?productProviderID=11'
        }).then(setDashBoardCards, errorCallBack);


        $http(
       {
           method: 'GET',
           url: 'http://nanofinapibeta.azurewebsites.net/api/Reports/getBestSellingProduct'
       }).then(BestProductSuccess, errorCallBack);


        $http(
      {
          method: 'GET',
          url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getCurrentMonthDailySales'
      }).then(successCallBack, errorCallBack);
       

        $http(
     {
         method: 'GET',
         url: 'http://nanofinapibeta.azurewebsites.net/api/Reports/getNumberOfUnprocessedApplications?ProviderID=11'
     }).then(unprocessedApplications, errorCallBack);

        

       
        Number.prototype.toMoney = function (decimals, decimal_sep, thousands_sep) {
            var n = this,
            c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
            d = decimal_sep || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

            /*
            according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
            the fastest way to check for not defined parameter is to use typeof value === 'undefined' 
            rather than doing value === undefined.
            */
            t = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

            sign = (n < 0) ? '-' : '',

            //extracting the absolute value of the integer part of the number and converting to string
            i = parseInt(n = Math.abs(n).toFixed(c)) + '',

            j = ((j = i.length) > 3) ? j % 3 : 0;
            return sign + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
        };


       

       

    }]);
