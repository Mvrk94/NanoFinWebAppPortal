angular.module('myApp')
    .controller('reportsController', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
    {

        var table;
        var unprocessedList;
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";

        angular.element(document).ready(function () {
            table = $("#tblApplications").DataTable
                ({
                    "paging": true,
                    "lengthChange": false,
                    "searching": true,
                    "ordering": true,
                    "info": true,
                    "autoWidth": false,
                    'columns':
                        [
                            { 'data': 'index' },
                            { 'data': 'month' },
                            { 'data': 'NumberofPurchases' },
                            { 'data': 'unitsSold' },
                            { 'data': 'OverallSales'},
                        ]
                });
        });

        var errorCallBack = function (response) {
            $scope.uprocessedApplications = response.data;
        };
        var successCallBack = function (response) {
            unprocessedList = response.data;
            table.rows.add(unprocessedList);
            table.draw();
        };
        $http(
        {
            method: 'GET',
            url: hostaddress + 'Reports/getInvoices?providerID=11'
        })
        .then(successCallBack, errorCallBack);


        var ProductSales = function (response)
        {

            var labels = [];
            var values = [];
            labels.push("");
            values.push(1);
            var counter = 0;

            for (var v in response.data)
            {
                labels.push( response.data[counter].name);
                values.push( response.data[counter].overallUsage);
                counter++;
            }


            var areaChartData =
            {  
                labels: labels,
                datasets: [
                    {
                        label: labels,
                        fillColor: "rgba(210, 214, 222, 1)",
                        strokeColor: "rgba(210, 214, 222, 1)",
                        pointColor: "rgba(210, 214, 222, 1)",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: values
                    }
                ]
            };
            
            var barChartCanvas = $("#barChart").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            barChartData.datasets[0].fillColor = "#00a65a";
            barChartData.datasets[0].strokeColor = "#00a65a";
            barChartData.datasets[0].pointColor = "#00a65a";
            //Chart.defaults.global.legend.display = false;
            var barChartOptions = {

                scaleFontSize: 0,
                //remove labels at the bottom
                showXAxisLabel: false,
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

                legend: {
                    display: false
                },

                tooltips :{
                    enabled: false
                },
                //Number - Spacing between data sets within X values
                barDatasetSpacing: 50,
                //String - A legend template
                //legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
                //Boolean - whether to make the chart responsive

                
                responsive: true,
                maintainAspectRatio: true
            };

            barChartOptions.datasetFill = true;
            barChart.Bar(barChartData, barChartOptions);
            //alert("please work");
        };

        $http(
       {
           method: 'GET',
           url: hostaddress +'Reports/getBestSellingProduct'
       })
       .then(ProductSales, errorCallBack);

    }]);
