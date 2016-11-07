/// <reference path="../../../wwwroot/assets/plugins/morris/morris.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/morris/morris.js" />
angular.module('myApp')
        .controller('CompareProducts', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

            $scope.getType = function (insuranceType) {
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

            var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";

            var canDraw = 0;

            var errorCallBack = function (response) {

                $scope.products = response.data;
            };

            var saveItemInformartion = function (response) {
                $scope.itemsData = response;

            };

            var setTargetSales = function (responce)
            {
                $scope.targetInfor = responce;
            };

            var setLocationData = function (responce) {

                $scope.ProvinceData = responce;
                $scope.initMap();
            };

            var setCompareProduct1 = function (responce) {
                $scope.product1data = responce.data;
                alert($scope.product1data.name);
                canDraw += 1;
                if (canDraw % 2 === 0)
                    drawCompareProducts();
            };

            var setCompareProduct2 = function (responce) {
                $scope.product2data = responce.data;
                alert($scope.product2data.name);
                canDraw += 1;
                if (canDraw % 2 === 0)
                    drawCompareProducts();
            };

            var fillOptions = function () {
                var result = "";
                var data = $scope.itemsData.data;
                for (var c = 0 ; c < data.length ; c++) {
                    result += "	<li  style='margin-bottom:9px;width:280px'>";
                    result += "	<div class='row'>";
                    result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                    result += "<label><input type='checkbox' id='checkbox" + data[c].ProductID + "' class='flat-red'></label>";
                    result += "	</div>";
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

            /*
                download product Sales
            */
            $http(
               {
                   method: 'GET',
                   url: hostaddress + 'ReportsMaster/getProductList'
               }).then(saveItemInformartion, errorCallBack);

            /*
                Product Compare Sales With Target
            */
            $scope.targetSales = function ()
            {
                fillOptions();
                $http(
                {
                    method: 'GET',
                    url: hostaddress + 'ReportsMaster/TargetProgrees?productProvider=11&numMonths=1'
                }).then(setTargetSales, errorCallBack);
            };

            $scope.drawToCanvas = function () {
                document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:830px;marign-left:29px;'></canvas>";
                var responce = $scope.targetInfor;
                var drawItems = [];
                var index = 0;
                var i = 0;
                var j = 0;

                for (var tmep in responce.data) {
                    var check = document.getElementById("checkbox" + responce.data[index].ProductID).checked;

                    if (check === true) {
                        i++;
                        drawItems.push(responce.data[index]);
                    }
                    index++;
                }

                var labels = [];
                var sales = [];
                var target = [];
                var counter = 0;

                for (var v in drawItems) {
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
            var drawCompareProducts = function () {
                var labels = [];
                var p1 = [];
                var p2 = [];
                var counter = 0;

                alert("compare product");

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
                fillOptions();
                document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></canvas>";
                var drawItems = [];
                var index = 0;
                var i = 0;
                var j = 0;
                var productlist = $scope.itemsData.data;
                var found = 0;
                for (var prod = 0 ; prod < productlist.length || found === 0; prod++) {
                    var check = document.getElementById("checkbox" + productlist[index].ProductID).checked;

                    if (check === true) {
                        i++;
                        found++;
                        alert(productlist[index].ProductID);
                        drawItems.push(productlist[index].ProductID);
                    }
                    index++;
                }

                $http(
                {
                    method: 'GET',
                    url: hostaddress + "ReportsMaster/getProductSalesPredictions?productID=" + drawItems[0] + "&numPredictions=5",
                }).then(setCompareProduct1, errorCallBack);

                $http(
                {
                    method: 'GET',
                    url: hostaddress + "ReportsMaster/getProductSalesPredictions?productID=" + drawItems[1] + "&numPredictions=5",
                }).then(setCompareProduct2, errorCallBack);
            };


            /*
                Compare Product Types only 2
            */
            var drawCompareTyes = function ()
            {

            };


            $scope.CompareProductTyeSales = function ()
            {
                fillProductSales();
                $http(
              {
                  method: 'GET',
                  url: hostaddress + 'ReportsMaster/getProductList'
              }).then(saveItemInformartion, errorCallBack);
            };

            /*
                Compare Product type forecasted sales +  probability to be true
            */
            $scope.ForecastProductSales = function ()
            {

            };

            $scope.CompareProductTypeForecast = function ()
            {
                $http(
              {
                  method: 'GET',
                  url: hostaddress + 'ReportsMaster/getProductList'
              }).then(saveItemInformartion, errorCallBack);
            };


        }]);

//AIzaSyBkIBUzzdZb8TgLRaECvmf6J6H9UZi23oc