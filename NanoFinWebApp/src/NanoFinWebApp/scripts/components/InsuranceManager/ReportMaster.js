/// <reference path="../../../wwwroot/assets/plugins/morris/morris.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/morris/morris.js" />
angular.module('myApp')
        .controller('reportsNaster', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
        
        var errorCallBack = function (response) {

            $scope.products = response.data;
        };

        var saveItemInformartion = function (response)
        {
            $scope.itemsData = response;
        };

        var getSalesTarget = function (responce)
        {
            $scope.targetInfor = responce;

        };

        var fillOptions = function ()
        {
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

        $http(
           {
               method: 'GET',
               url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductList'
           }).then(saveItemInformartion, errorCallBack);


        $scope.targetSales = function ()
        {
            fillOptions();
            $http(
            {
                method: 'GET',
                url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/TargetProgrees?productProvider=11'
            }).then(getSalesTarget, errorCallBack);
        };

        $scope.drawToCanvas = function ()
        {

            var responce = $scope.targetInfor;
            var drawItems = [];
            var index = 0;
            var i = 0;
            var j = 0;

            for (var tmep in responce.data)
            {
                var check = document.getElementById("checkbox" + responce.data[index].ProductID).checked;

                if (check != false)
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
                labels.push(temp.ProductID);
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
                barValueSpacing: 5,
                //Number - Spacing between data sets within X values
                isFixedWidth: false,
                barWidth: 20,

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


        $scope.compareProuctsCanvas = function () {

            var responce = $scope.targetInfor;
            var drawItems = [];
            var index = 0;

            for (var tmep in responce.data) {
                var check = document.getElementById("checkbox" + responce.data[index].ProductID).checked;

                if (check != false)
                {
                    drawItems.push(responce.data[index]);
                }
                index++;
            }

            var labels = [];
            var sales = [];
            var target = [];
            var counter = 0;


            var satasets = [];

            for (var v in drawItems)
            {
                var temp = drawItems[counter];
                //labels.push(temp.ProductID);
                //sales.push(temp.currentSales);
                //target.push(temp.targetSales);
                var tempDataset =
                {
                    label: temp.ProductID,
                    fillColor: "rgba(210, 214, 222, 1)",
                    strokeColor: "rgba(210, 214, 222, 1)",
                    pointColor: "rgba(210, 214, 222, 1)",
                    pointStrokeColor: "#c1c7d1",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: sales
                };

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
            //document.getElementById("canvasData").innerHTML = 0;
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
                barValueSpacing: 5,
                //Number - Spacing between data sets within X values
                isFixedWidth: false,
                barWidth: 20,

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



            //AIzaSyCt2traC_kQPwyOqg4cpyi0SLk_9__eN9U
        /*
            Monthly Sales with Predictions
        */
        var monthylsalesData = function (responce)
        {
            alert("please");
            var datasets = [];
            var counter = 1;
            var year = 4;
            var quarter = 1;
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
                element: 'line-chart',
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

        $scope.initMap = function ()
        {
            alert("am here");
           var  map = new google.maps.Map(document.getElementById('map'),
                    {
                        center: { lat: -25.397, lng: 12.644 },
                        zoom: 8,
                        scrollwheel: false,
                    });
        };
       
        var salesPerProvince = function ()
        {
            
        };

}]);

//AIzaSyBkIBUzzdZb8TgLRaECvmf6J6H9UZi23oc