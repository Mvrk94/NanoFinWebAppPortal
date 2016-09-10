/// <reference path="../../../wwwroot/assets/plugins/morris/morris.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/morris/morris.js" />
angular.module('myApp')
        .controller('reportsNaster', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
        {
         
            var insurancetypeIDs = [1, 2, 11, 21, 31];
            var insurancetypeNames = ["Assets", "Travel", "Legal", "Medical", "Medical"];
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



            var fillInsuranceType = function () {
                var result = "";
                //var insurancetypeNames = ["Assets", "Travel", "Legal", "Medical", "Funeral"];
               // var insurancetypeIDs = [1, 2, 11, 21, 31];
                var insurancetypeIDs = [1, 2, 11, 21, 31];
                for (var c = 0 ; c < insurancetypeIDs.length ; c++) {
                    result += "	<li  style='margin-bottom:9px;width:280px'>";
                    result += "	<div class='row'>";
                    result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                    result += "<label><input type='checkbox' id='checkbox" + insurancetypeIDs[c] + "' class='flat-red'></label>";
                    result += "	</div>";
                    //alert(data[c].Product_ID)
                    result += "";
                    result += "	<div class='col-sm-7 col-sm-push-1 removePersonalSpace' style='width:250px'>";
                    result += String(insurancetypeNames[c]) + " <br />";
                    result += "<span style='font-size:12px'>." + "</span>";
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


            var insurnaceTypeSelected = [];
            var canDraw = 0;
            var canDrawInsuranceType = 0;

        var errorCallBack = function (response) {

            $scope.products = response.data;
        };

        var saveItemInformartion = function (response)
        {
            $scope.itemsData = response;
            //fillOptions();
           fillInsuranceType();
        };

        var setTargetSales = function (responce)
        {
            $scope.targetInfor = responce;

        };

        var setProduct1 = function (responce)
        {
            $scope.product1data = responce.data;
            canDraw += 1;
            if (canDraw % 2 === 0)
                drawCompareProducts();
        };

        var setProduct2 = function (responce)
        {
            $scope.product2data = responce.data;
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

        $http(
        {
            method: 'GET',
            url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/TargetProgrees?productProvider=11&numMonths=1'
        }).then(setTargetSales, errorCallBack);

        /*
            Product Compare Sales With Target
        */
        $scope.targetSales = function ()
        {
            fillOptions();
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
            
            var datasets = [];
            var counter = 1;

            var name1 = $scope.product1data.name + " in ZAR";
            var name2 = $scope.product2data.name + " in ZAR";

            //var date = new Date(Date.UTC(2015, 1, 1));
            //var options = { year: "numeric" };

            //alert(date.toLocaleDateString("en-US", options));
            var year = 5;
            var month = 1;
            var str = "";
            for (var n = 0 ; n < 6 ;  n++)
            {
                str = String("201" + String(year) + "-" + String(counter));
                alert(str);
                datasets.push({ period: str, licensed: parseFloat( $scope.product1data.previouse[counter]).toFixed(2), sorned: parseFloat($scope.product2data.previouse[counter]).toFixed(2) });

                counter++;
                month++;

                if (counter == 12)
                {
                    year++;
                    month = 1;
                }
            }
            canDrawInsuranceType = 0;
            counter = 0;
            
            //var predictionsDate = new Date(Date.UTC(2016, 9, 1));
            for (var y = 0 ; y < 5 ;y++)
            {
                var str = String("201" + String(year) + "-" + String(month));
                alert(str);
                datasets.push({ period: str, licensed: parseFloat( $scope.product1data.predictions[counter]).toFixed(2), sorned: parseFloat( $scope.product2data.predictions[counter]).toFixed(2) });
                month++;
                counter++;
                if (counter == 12)
                {
                    year++;
                    month = 1;
                }
                //predictionsDate.setMonth(date.getMonth() + 1);
            }


            var line = new Morris.Line({
                element: 'canvasData',
                resize: true,
                data: datasets,
                xkey: 'period',
                ykeys: ['licensed', 'sorned'],
                labels: [name1, name2],
                //lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
               // gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
               // pointStrokeColors: ["#efefef"],
               // gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
            });

        };


        $scope.compareProuctsCanvas = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></div>";
            //document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></canvas>";
            var drawItems = [];
            var index = 0;
            var productlist = $scope.itemsData.data;
            var found = 0;
            for (var prod = 0 ; prod < productlist.length && found < 2; prod++)
            {
                var check = document.getElementById("checkbox" + productlist[index].Product_ID).checked;

                if (check === true)
                {
                    found++;
                    alert(found);
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
        
           
        /*
            CURENT MONTH INSURANCE TYPE SALES
        */
        var SetinsuranceTypeData = function (responce)
        {
            $scope.insuranceTypedata = responce.data;
            drawcurrentMonthInsuranceType(responce.data);
        };

        $scope.insuranceTypeSales = function (responce) {

            $http(
              {
                  method: 'GET',
                  url: 'http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getLastMonthInsuranceTypeSales'
              }).then(SetinsuranceTypeData, errorCallBack);
        };
        
        drawcurrentMonthInsuranceType = function (responce) {
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:830px;marign-left:29px;'></canvas>";
            var labels = [];
            var sales = [];
            var counter = 0;

            for (var v in responce) {
                var temp = responce[counter];
                labels.push($scope.getType(temp.InsuranceType_ID));
                sales.push(temp.monthSales);
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
                    }
                ]
            };
            document.getElementById("canvasData").innerHTML = 0;
            var barChartCanvas = $("#canvasData").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
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
                barValueSpacing: 20,
                //Number - Spacing between data sets within X values
                isFixedWidth: true,
                barWidth: 5,

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
            COMPARE INSURANCE TYPE SALES
        */
        var setinsurance1 = function (responce) {
            $scope.insurace1data = responce.data;
            canDrawInsuranceType += 1;
            if (canDrawInsuranceType % 2 === 0)
                drawCompareInsuranceType();
        };

        var setinsurance2 = function (responce) {
            $scope.insurace2data = responce.data;
            canDrawInsuranceType += 1;
            if (canDrawInsuranceType % 2 === 0)
                drawCompareInsuranceType();
        };

        $scope.compareInsuranceTypes = function()
        {
            //fillInsuranceType();

            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></div>";
            //document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></canvas>";
            var drawItems = [];


            var index = 0;

            var found = 0;


            //for (var prod = 0 ; prod < insurancetypeIDs.length && found < 2; prod++)
            //{
            //    var check = document.getElementById("checkbox" + insurancetypeIDs[index]).checked;

            //    alert(check);
            //    alert(insurancetypeIDs[index]);
            //    if (check === true)
            //    {
            //        found++;
            //        alert(found);
            //        drawItems.push(insurancetypeIDs[index]);
            //    }
            //    index++;
            //}
            insurnaceTypeSelected = [];
            insurnaceTypeSelected.push(drawItems[0]);
            insurnaceTypeSelected.push(drawItems[1]);

            $http(
            {
                method: 'GET',
                //url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=" + drawItems[0] + "&numPredictions=5",
                url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=1&numPredictions=5",
            }).then(setinsurance1, errorCallBack);

            $http(
            {
                method: 'GET',
                url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=21&numPredictions=5",
                //url: "http://nanofinapibeta.azurewebsites.net/api/ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=" + drawItems[1] + "&numPredictions=5",
            }).then(setinsurance2, errorCallBack);
        };


        var drawCompareInsuranceType = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:395px;width:840px;marign-left:29px;'></div>";
            var labels = [];

            var datasets = [];
            var counter = 1;

            var name1 = $scope.getType(insurnaceTypeSelected[0]) + " in ZAR";
            var name2 = $scope.getType(insurnaceTypeSelected[1]) + " in ZAR";

            alert($scope.insurace1data);
            alert($scope.insurace2data);

            var date = new Date(Date.UTC(2015, 1, 1));
            var options = { year: "numeric" };
            var str = "";
            alert(date.toLocaleDateString("en-US", options));
            var year = 5;
            var month = 1;
            for (var n = 0 ; n < 6 ; n++) {
                str = String("201" + String(year) + "-" + String(counter));
                //alert(str);
                datasets.push({ period: str, licensed: parseFloat($scope.insurace1data.previouse[counter]).toFixed(2), sorned: parseFloat($scope.insurace2data.previouse[counter]).toFixed(2) });

                counter++;
                month++;
                if (counter == 12) {
                    year++;
                    month = 1;
                }
            }
            canDraw = 0;
            counter = 0;

            var predictionsDate = new Date(Date.UTC(2016, 9, 1));
            for (var y = 0 ; y < 5 ; y++) {
                str = String("201" + String(year) + "-" + String(month));
                //alert(str);
                datasets.push({ period: str, licensed: parseFloat($scope.insurace1data.predictions[counter]).toFixed(2), sorned: parseFloat($scope.insurace2data.predictions[counter]).toFixed(2) });
                month++;
                counter++;
                if (counter == 12) {
                    year++;
                    month = 1;
                }
                //predictionsDate.setMonth(date.getMonth() + 1);
            }
            alert("data set");


            var line = new Morris.Line({
                element: 'canvasData',
                resize: true,
                data: datasets,
                xkey: 'period',
                ykeys: ['licensed', 'sorned'],
                labels: [name1, name2],
                //lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
                // gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                // pointStrokeColors: ["#efefef"],
                // gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
            });

        };
    
      

        $scope.viewCurrentMonthProductSales = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:395px;width:830px;marign-left:29px;'></canvas>";
            var responce = $scope.targetInfor;
            var drawItems = [];
            var index = 0;
            var i = 0;
            var j = 0;

            for (var tmep in responce.data)
            {
                drawItems.push(responce.data[index]);
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
            alert(drawItems.length);
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
                    }
                ]
            };
            document.getElementById("canvasData").innerHTML = 0;
            var barChartCanvas = $("#canvasData").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            var barChartOptions =
            {
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

                tooltips: {
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

            barChartOptions.datasetFill = false;
            barChart.Bar(barChartData, barChartOptions);

        };




}]);

//AIzaSyBkIBUzzdZb8TgLRaECvmf6J6H9UZi23oc

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
/*
    COMPARE PRODUCT SALES        
*/
