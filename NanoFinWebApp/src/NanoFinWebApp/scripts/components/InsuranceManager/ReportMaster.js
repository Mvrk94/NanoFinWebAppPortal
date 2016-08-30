angular.module('myApp')
        .controller('reportsNaster', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {
        
        var errorCallBack = function (response) {

            $scope.products = response.data;
        };

        $scope.getType =  function(insuranceType)
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

        $scope.mgsBox = function () {
            alert("delta");
        };



        var fileWithProducts = function (response)
        {
            var result = "";
            result += "<li style='font-size:19px' >  <br /><br /></li>";
            result += "<li style='margin-bottom:7px'> <button type='button' class='btn btn-block btn-default'>Submit</button> </li>";
            var data = response.data;
            for (var c = 0 ; c < data.length ; c++) {
                result += "	<li  style='margin-bottom:9px'>";
                result += "	<div class='row'>";
                result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                //result += "	<label>";
                //result += "	<input type='checkbox' id='ckeckbox" + data[c].ProductID + "'>";
                //result += "	</label>";
                result += "<label ng-click='msgBox()'><input type='checkbox' id='checkbox'" + data[c].ProductID + " class='minimal'></label>";
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
            
            //$("#itemList").html(result)
            var element = document.getElementById("itemList");
            element.innerHTML = result;

            for (var c = 0 ; c < data.length ; c++)
            {
                var check  = document.getElementById("checkbox" + data[c].ProductID);

            }


            //$compile($("#itemList").contents())($scope);
        };

        var selectItems = [];


        $http(
           {
               method: 'GET',
               url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductList'
           }).then(fileWithProducts, errorCallBack);


        $scope.targetSales = function ()
        {
            $http(
            {
                method: 'GET',
                url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/TargetProgrees?productProvider=11'
            }).then(TargetSalesCanvas, errorCallBack);
        };
         
        var drawTargetSales = function () {
            var selectedCheckbx = document.getElementById("");
            var check = selectedCheckbx.getElementsByTagName("li");




        };


        var TargetSalesCanvas = function (response)
        {
            var labels = [];
            var sales = [];
            var target = [];
            labels.push("");
            target.push(1);
            var counter = 0;

            for (var v in response.data) {
                labels.push(String(response.data[counter].ProductID));
                sales.push(response.data[counter].currentSales );
                target.push(response.data[counter].targetSales);
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
       

    }]);