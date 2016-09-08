/// <reference path="../../../wwwroot/assets/plugins/morris/morris.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/morris/morris.js" />
angular.module('myApp')
        .controller('reportsNaster', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
        {
         
            $scope.getType = function (insuranceType)
            {
                if (insuranceType == 1)
                    return "Assets";
                else if (insuranceType == 2)
                    return "Travel";
                else if (insuranceType == 11)
                    return "Legal";

                else if (insuranceType == 21)
                    return "Medical";
                else if (insuranceType == 31)
                    return "Funeral";


                return "Value Added";
            };

        var canDraw = 0;

        var errorCallBack = function (response) {

            $scope.products = response.data;
        };

        var saveItemInformartion = function (response)
        {
            $scope.itemsData = response;
            fillOptions();
        };

        var setTargetSales = function (responce)
        {
            $scope.targetInfor = responce;

        };

        var setLocationData = function (responce) {

            $scope.ProvinceData = responce;
            $scope.initMap();
        };

        var setProduct1 = function (responce) {
            $scope.product1data = responce.data;
            //alert($scope.product1data.name);
            canDraw += 1;
            if (canDraw % 2 === 0)
                drawCompareProducts();
        };

        var setProduct2 = function (responce) {
            $scope.product2data = responce.data;
            //alert($scope.product2data.name);
            canDraw += 1;
            if (canDraw % 2 === 0)
                drawCompareProducts();
        };

        var fillOptions = function ()
        {
            var result = "";
            var data = $scope.itemsData.data;
            for (var c = 0 ; c < data.length ; c++) {
                result += "	<li  style='margin-bottom:9px;width:280px'>";
                result += "	<div class='row'>";
                result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                result += "<label><input type='checkbox' id='checkbox" + data[c].Product_ID + "' class='flat-red'></label>";
                result += "	</div>";
                //alert(data[c].Product_ID)
                result += "";
                result += "	<div class='col-sm-7 col-sm-push-1 removePersonalSpace' style='width:250px'>";
                result += String(data[c].name) + " <br />";
                result += "<span style='font-size:12px'>" + $scope.getType(data[c].insuranceType) + "</span>";
                result += "</div>";
                result += "</div>";
                result += "</li>";
            }

            result += "<li style='font-size:19px' >  <br /> <br /></li>";

            var element = document.getElementById("itemList");
            element.innerHTML = result;

            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck
            ({
                checkboxClass: 'icheckbox_flat-green',
            });
        };

        $http(
           {
               method: 'GET',
               url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductList'
           }).then(saveItemInformartion, errorCallBack);

        /*
            Product Compare Sales With Target
        */
        $scope.targetSales = function ()
        {
            $http(
            {
                method: 'GET',
                url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/TargetProgrees?productProvider=11&numMonths=1'
            }).then(setTargetSales, errorCallBack);
        };

        $scope.drawToCanvas = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:830px;marign-left:29px;'></canvas>";
            var responce = $scope.targetInfor;
            var drawItems = [];
            var index = 0;
            var i = 0;
            var j = 0;

            for (var tmep in responce.data)
            {
                var check = document.getElementById("checkbox" + responce.data[index].ProductID).checked;

                if (check === true)
                {
                    i++;
                    drawItems.push(responce.data[index]);
                }
                index++;
            }

            var labels = [];
            var sales = [];
            var target = [];
            var counter = 0;

            for (var v in drawItems)
            {
                var temp = drawItems[counter];
                labels.push(temp.name);
                sales.push(temp.currentSales);
                target.push(temp.targetSales);
                counter++;
            }
            var areaChartData =
            {
                labels: labels,
                datasets: [
                    {
                        label: "Sales",
                        fillColor: "rgba(210, 214, 222, 1)",
                        strokeColor: "rgba(210, 214, 222, 1)",
                        pointColor: "rgba(210, 214, 222, 1)",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: sales
                    },
                    {
                        label: "Target",
                        fillColor: "rgba(210, 214, 222, 1)",
                        strokeColor: "rgba(210, 214, 222, 1)",
                        pointColor: "rgba(210, 214, 222, 1)",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: target
                    }
                ]
            };
            document.getElementById("canvasData").innerHTML = 0;
            var barChartCanvas = $("#canvasData").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            barChartData.datasets[1].fillColor = "#00a65a";
            barChartData.datasets[1].strokeColor = "#00a65a";
            barChartData.datasets[1].pointColor = "#00a65a";
            var barChartOptions =
            {
                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero: true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,
                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth: 1,
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
                //Boolean - If there is a stroke on each bar
                barShowStroke: true,
                //Number - Pixel width of the bar stroke
                barStrokeWidth: 2,
                //Number - Spacing between each of the X value sets
                barValueSpacing: 8,
                //Number - Spacing between data sets within X values
                isFixedWidth: false,
                barWidth: 10,

                barDatasetSpacing: 1,
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
                //Boolean - whether to make the chart responsive
                responsive: true,
                maintainAspectRatio: true
            };

            barChartOptions.datasetFill = false;
            barChart.Bar(barChartData, barChartOptions);


        };

        /*
            compare product sales
        */
        var drawCompareProducts = function ()
        {
            var labels = [];
            var p1 = [];
            var p2 = [];
            var counter = 0;

            //alert("compare product");

            for (var t in $scope.product1data.predictions) {
                p1.push($scope.product1data.predictions[counter]);
                counter++;
            }

            counter = 0;
            for (var y in $scope.product2data.predictions) {
                p2.push($scope.product2data.predictions[counter]);
                counter++;
                labels.push("2016 - " + counter);
            }
            var color1 = "#d35400";
            var color2 = "#f1c40f";
            var areaChartData =
            {
                labels: labels,
                datasets: [
                    {
                        label: "Sales",
                        fillColor: color1,
                        strokeColor: color1,
                        pointColor: color1,
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: color1,
                        data: p1
                    },
                    {
                        label: "Target",
                        fillColor: color2,
                        strokeColor: color2,
                        pointColor: color2,
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: color2,
                        data: p2
                    }
                ]
            };
            var barChartCanvas = $("#canvasData").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            //barChartData.datasets[1].fillColor = "#00a65a";
            //barChartData.datasets[1].strokeColor = "#00a65a";
            //barChartData.datasets[1].pointColor = "#00a65a";
            var barChartOptions =
            {
                //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
                scaleBeginAtZero: true,
                //Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,
                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(0,0,0,.05)",
                //Number - Width of the grid lines
                scaleGridLineWidth: 1,
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
                //Boolean - If there is a stroke on each bar
                barShowStroke: true,
                //Number - Pixel width of the bar stroke
                barStrokeWidth: 2,
                //Number - Spacing between each of the X value sets
                barValueSpacing: 10,
                //Number - Spacing between data sets within X values
                isFixedWidth: false,
                barWidth: 15,

                barDatasetSpacing: 5,
                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
                //Boolean - whether to make the chart responsive
                responsive: true,
                maintainAspectRatio: true
            };

            barChartOptions.datasetFill = false;
            barChart.Bar(barChartData, barChartOptions);
        };

      

        $scope.compareProuctsCanvas = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></canvas>";
            var drawItems = [];
            var index = 0;
            var i = 0;
            var j = 0;
            var productlist = $scope.itemsData.data;
            var found = 0;
            for (var prod = 0 ; prod < productlist.length || found == 0; prod++)
            {
                var check = document.getElementById("checkbox" + productlist[index].Product_ID).checked;

                if (check === true)
                {
                    i++;
                    found++;
                    //alert(productlist[index].Product_ID);
                    drawItems.push(productlist[index].Product_ID);
                }
                index++;
            }

            $http(
            {
                method: 'GET',
                url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductSalesPredictions?productID=" + drawItems[0] + "&numPredictions=5",
            }).then(setProduct1, errorCallBack);

            $http(
            {
                method: 'GET',
                url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductSalesPredictions?productID=" + drawItems[1] + "&numPredictions=5",
            }).then(setProduct2, errorCallBack);

            //product2data
           

        };

            //AIzaSyCt2traC_kQPwyOqg4cpyi0SLk_9__eN9U
        /*
            Monthly Sales with Predictions
        */
        var monthylsalesData = function (responce)
        {
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></div>";
            //alert("please");
            var datasets = [];
            var counter = 1;
            var year = 5;
            var quarter = 2;
            var insert = 4;
            var index = 0;
            var date;

            for (var r in responce.data.previouse)
            {
                if (insert == 4)
                {
                     date = "201" + String(year) + " Q" + String(quarter);
                    datasets.push({ y: date, item1: responce.data.previouse[index], item2: responce.data.previouse[index] });
                    if (quarter == 4)
                    {
                        year += 1;
                        quarter = 1;
                    }
                    quarter++;
                    counter++;
                    index += 4;
                    insert = 1;
                }
                insert++;
            }

            for (var pr in responce.data.predictions) {
                if (insert == 4) {
                     date = "201" + String(year) + " Q" + String(quarter);
                    datasets.push({ y: date, item1: responce.data.predictions[index], item2: responce.data.predictions[index] });
                    if (quarter == 4) {
                        year += 1;
                        quarter = 1;
                    }
                    quarter++;
                    counter++;
                    index += 4;
                    insert = 1;
                }
                insert++;
            }

            var line = new Morris.Line({
                element: 'canvasData',
                resize: true,
                data: datasets,
                xkey: 'y',
                ykeys: ['item1'],
                labels: ['sales in ZAR'],
                lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
                gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                pointStrokeColors: ["#efefef"],
                gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
            });
        };


        $scope.drawMonthlySales =  function()
        {
            $http(
           {
               method: 'GET',
               url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getPPMonthlySalesForecast?productProvider=11&numPredictions=3&value1=1&value2=1'
           }).then(monthylsalesData, errorCallBack);
        };


        $scope.drawMapdata = function ()
        {
            
            $http(
         {
             method: 'GET',
             url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/get_PP_ProvincialSales?productProvider=11'
         }).then(setLocationData, errorCallBack);
            
        };
       
        //function loadScript(url, callback) {
        //    // Adding the script tag to the head as suggested before
        //    var head = document.getElementsByTagName('head')[0];
        //    var script = document.createElement('script');
        //    script.type = 'text/javascript';
        //    script.src = url;

        //    // Then bind the event to the callback function.
        //    // There are several events for cross browser compatibility.
        //    script.onreadystatechange = callback;
        //    script.onload = callback;

        //    // Fire the loading
        //    head.appendChild(script);
        //    //alert("am here");
        //}

        $scope.initMap = function ()
        {
            var currentTime = new Date().getTime();

            while (currentTime + 1000 >= new Date().getTime()) {
            }
            //alert("am here 2");


            var map = new google.maps.Map(document.getElementById('canvasData'),
            {
                center: { lat: -30.106538, lng: 22.485489 },
                zoom: 8,
                scrollwheel: false,
            });

            var markers = [];
            var counter = 0;
            for (var local in responce.data) {
                var pos = String(responce.data[counter].LatLng).split(',');
                var lat = pos[0];
                var lng = pos[1];
                var temp = new google.maps.Marker({
                    map: map,
                    position: { lat: parseFloat(pos[0]), lng: parseFloat(pos[1]) },
                    title: responce.data[counter].Province + "R " + responce.data[counter].sales,
                });
                counter++;
            }
        };

        var message = function () {
            //alert("hahaha");
        };

    /*
        COMPARE PRODUCT SALES        
    */

      

}]);

//AIzaSyBkIBUzzdZb8TgLRaECvmf6J6H9UZi23oc