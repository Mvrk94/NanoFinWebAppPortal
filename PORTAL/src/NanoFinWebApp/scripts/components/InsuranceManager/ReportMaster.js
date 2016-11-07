/// <reference path="../../../wwwroot/assets/plugins/morris/morris.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/morris/morris.js" />
angular.module('myApp')
        .controller('reportsNaster', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
        {

        var insurancetypeIDs = [1, 21, 31];
        var insurancetypeNames = ["Assets", "Medical", "Funeral"];
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";
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
        $scope.reportName = " ";
        $scope.shortdescription = "";

        var fillInsuranceType = function ()
        {
            var result = "";
                
            var insurancetypeIDs = [1,21, 31];
            for (var c = 0 ; c < insurancetypeIDs.length ; c++)
            {
                result += "	<li  style='margin-bottom:9px;width:280px'>";
                result += "	<div class='row'>";
                result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                result += "<label><input type='checkbox' id='checkbox" + insurancetypeIDs[c] + "' class='flat-red'></label>";
                result += "	</div>";
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

        var errorCallBack = function (response)
        {
            $scope.products = response.data;
        };

        var saveItemInformartion = function (response)
        {
            $scope.itemsData = response;
            //fillOptions();
            document.getElementById("drawReport").style.visibility = 'hidden';
            //fillInsuranceType();
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
            var data = $scope.targetInfor.data;
            for (var c = 0 ; c < data.length ; c++)
            {
                result += "	<li  style='margin-bottom:9px;width:280px'>";
                result += "	<div class='row'>";
                result += "	<div class='col-sm-1 col-sm-push-1 removePersonalSpace'>";
                result += "<label><input type='checkbox' id='checkbox" + data[c].Product_ID + "' class='flat-red'></label>";
                result += "	</div>";
                //alert(data[c].Product_ID)
                result += "";
                result += "	<div class='col-sm-7 col-sm-push-1 removePersonalSpace' style='width:250px'>";
                result += String(data[c].productName) + " <br />";
                result += "<span style='font-size:12px'>" + $scope.getType(data[c].InsuranceType_ID) + "</span>";
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
               url: hostaddress + 'ReportsMaster/getProductList'
           }).then(saveItemInformartion, errorCallBack);

        $http(
        {
            method: 'GET',
            url: hostaddress + 'ReportsMaster/TargetProgrees?productProvider=11&numMonths=9'
        }).then(setTargetSales, errorCallBack);


        /*
            Product Compare Sales With Target
        */
        $scope.targetSales = function ()
        {
            document.getElementById("drawReport").style.visibility = 'visible';
            turnOnMainList("btntargetSales");
            document.getElementById("insertCanvas").innerHTML = "";
            fillOptions();
            $scope.reportName = "Current  Month  sales  vs  Target  sales";
            $scope.shortdescription = " The graph below compares the selected product’s sales with target sales that you set for this month. Sales are in Rands.";

            document.getElementById("drawReport").onclick = function ()
            {
                $scope.reportName = "Current  Month  sales  vs  Target  sales";
                $scope.shortdescription = " The graph below compares the selected product’s sales with target sales that you set for this month. Sales are in Rands.";
                $scope.drawTargetToCanvas();
            };
        };

        $scope.drawTargetToCanvas = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:385px;width:830px;marign-left:29px;'></canvas>";
            var responce = $scope.targetInfor;
            
            var drawItems = [];
            var index = 0;
            var i = 0;
            var j = 0;

            for (var tmep in responce.data)
            {
                var check = false;
                check = document.getElementById("checkbox" + responce.data[index].Product_ID).checked;
                if (check === true)
                {
                    drawItems.push(responce.data[index]);
                }
                check = false;
                 
                index++;
            }

            var labels = [];
            var sales = [];
            var target = [];
            var counter = 0;

            for (var v in drawItems)
            {
                var temp = drawItems[counter];
                labels.push(temp.productName + " in ZAR");
                sales.push(temp.sales);
                target.push(temp.salesTargetAmount);
                counter++;
            }
            var areaChartData =
            {
                labels: labels,
                datasets: [
                    {
                        label: "Sales",
                        fillColor: "#FF9966",
                        strokeColor: "#FF9966",
                        pointColor: "#FF9966",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#FF9966",
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

            var color2 = "#79BEDB";
            barChartData.datasets[1].fillColor = color2;
            barChartData.datasets[1].strokeColor = color2;
            barChartData.datasets[1].pointColor = color2;
            

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
            var counter = 0;

            counter  =  parseInt(String($scope.product1data.previouse.length)) - 7;
            counterp2 = parseInt(String($scope.product2data.previouse.length)) - 7;

            var name1 = $scope.product1data.name + " in ZAR";
            var name2 = $scope.product2data.name + " in ZAR";

            $scope.reportName = $scope.product1data.name + "  Sales vs  " + $scope.product2data.name + "  Sales";
            $scope.shortdescription = " The graph below compares the two select product sales. The last six months sales together with the forecasted sales of each selected product. Sales are in Rands.";
            //var date = new Date(Date.UTC(2015, 1, 1));
            //var options = { year: "numeric" };

            //alert(date.toLocaleDateString("en-US", options));
            var year = 6;
            var month = 3;
            var str = "";
            for (var n = 0 ; n < 6 ;  n++)
            {
                str = String("201" + String(year) + "-" + String(month));
                datasets.push({ period: str, licensed: parseFloat($scope.product1data.previouse[counter]).toFixed(2), sorned: parseFloat($scope.product2data.previouse[counterp2]).toFixed(2) });
                month++;
                counter++;
                counterp2++;

                if (month == 12)
                {
                    year++;
                    month = 1;
                }
            }
            counter = 0;
            canDrawInsuranceType = 0;
            
            for (var y = 0 ; y < 6 ;y++)
            {
                str = String("201" + String(year) + "-" + String(month));
                datasets.push({ period: str, licensed: parseFloat( $scope.product1data.predictions[counter]).toFixed(2), sorned: parseFloat( $scope.product2data.predictions[counter]).toFixed(2) });
                month++;
                counter++;
                if (month == 12)
                {
                    year++;
                    month = 1;
                }
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
            document.getElementById("drawReport").style.visibility = 'visible';
            fillOptions();
            turnOnMainList("btnCompareProducts");
            document.getElementById("insertCanvas").innerHTML = "";
            $scope.reportName = "Compare  Two  Products";
            $scope.shortdescription = " The graph will  show the two select product sales. The last six months sales together with the forecasted sales of each selected product. Sales are in Rands.";

            document.getElementById("drawReport").onclick = function ()
            {
                document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:385px;width:840px;marign-left:29px;'></div>";
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
                        drawItems.push(productlist[index].Product_ID);
                    }
                    index++;
                }

                $http(
                {
                    method: 'GET',
                    url:hostaddress+ "ReportsMaster/getProductSalesPredictions?productID=" + drawItems[0] + "&numPredictions=7&value1=1&value2=2",
                }).then(setProduct1, errorCallBack);

                $http(
                {
                    method: 'GET',
                    url: hostaddress + "ReportsMaster/getProductSalesPredictions?productID=" + drawItems[1] + "&numPredictions=7&value1=2&value2=2",
                }).then(setProduct2, errorCallBack);
            };
        };
        
           
        /*
            CURENT MONTH INSURANCE TYPE SALES
        */
        var SetinsuranceTypeData = function (responce)
        {
            $scope.insuranceTypedata = responce.data;
            drawcurrentMonthInsuranceType(responce.data);
        };

        $scope.insuranceTypeSales = function (responce)
        {
            document.getElementById("drawReport").style.visibility = 'hidden';
            document.getElementById("itemList").innerHTML = "";
            document.getElementById("insertCanvas").innerHTML = "";
            $scope.reportName = "";
            turnOnMainList("btnOverallInsuranceTypes");
            $http(
              {
                  method: 'GET',
                  url: hostaddress + 'ReportsMaster/getLastMonthInsuranceTypeSales'
              }).then(SetinsuranceTypeData, errorCallBack);
        };
        
       var drawcurrentMonthInsuranceType = function (responce)
       {
           $scope.reportName = "Current  Month  Insurance  Type  Sales";
           $scope.shortdescription = " The graph below displays each insurance type sales for the current month. Sales are in Rands";
            document.getElementById("insertCanvas").innerHTML = "<canvas  class='chart' id='canvasData' style='height:385px;width:830px;marign-left:29px;'></canvas>";
            var labels = [];
            var sales = [];
            var counter = 0;

            for (var v in responce)
            {
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
                        fillColor: "#FF9966",
                        strokeColor: "#FF9966",
                        pointColor: "#FF9966",
                        pointStrokeColor: "#c1c7d1",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "#FF9966",
                        data: sales
                    }
                ]
            };
            document.getElementById("canvasData").innerHTML = 0;
            var barChartCanvas = $("#canvasData").get(0).getContext("2d");
            var barChart = new Chart(barChartCanvas);
            var barChartData = areaChartData;
            

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
            fillInsuranceType();
            turnOnMainList("btnCompareType");
            document.getElementById("insertCanvas").innerHTML = "";
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:385px;width:840px;marign-left:29px;'></div>";
            document.getElementById("drawReport").style.visibility = 'visible';
            $scope.reportName = "Compare  Insurance  Types  Sales";
            $scope.shortdescription = "The graph below compares two insurance type sales. Its shows sales from the last six and forecasts the next Six.";
            document.getElementById("drawReport").onclick = function ()
            {
            
                var drawItems = [];
                var index = 0;
                var found = 0;

                for (var prod = 0 ; prod < insurancetypeIDs.length && found < 2; prod++)
                {
                    var check = document.getElementById("checkbox" + insurancetypeIDs[index]).checked;

                    if (check === true)
                    {
                        found++;
                        drawItems.push(insurancetypeIDs[index]);
                    }
                    index++;
                }
                insurnaceTypeSelected = [];
                insurnaceTypeSelected.push(drawItems[0]);
                insurnaceTypeSelected.push(drawItems[1]);

                $http(
                {
                    method: 'GET',
                    url: hostaddress + "ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=" + drawItems[0] + "&numPredictions=6&value1=1&value2=2",
                }).then(setinsurance1, errorCallBack);

                $http(
                {
                    method: 'GET',
                    url: hostaddress + "ReportsMaster/PredictInsuranceTypeSales?insuranceTypeID=" + drawItems[1] + "&numPredictions=6&value1=1&value2=2",
                }).then(setinsurance2, errorCallBack);
            };
        };


        var drawCompareInsuranceType = function ()
        {
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:385px;width:840px;marign-left:29px;'></div>";
            var labels = [];

            var datasets = [];
            var counter = 1;

            counter = parseInt(String($scope.insurace1data.previouse.length)) - 7;
            var counterp2 = parseInt(String($scope.insurace2data.previouse.length)) - 7;

            var name1 = $scope.getType(insurnaceTypeSelected[0]) + " in ZAR";
            var name2 = $scope.getType(insurnaceTypeSelected[1]) + " in ZAR";

            $scope.reportName = $scope.getType(insurnaceTypeSelected[0]) + "  Product  Sales  vs " + $scope.getType(insurnaceTypeSelected[1]) + "  Product  Sales";
            $scope.shortdescription = "The graph below compares Two insurance type sales. Its shows sales from the last Six and Forecasts the next Six.";

            var date = new Date(Date.UTC(2015, 1, 1));
            var options = { year: "numeric" };
            var str = "";
            var year = 6;
            var month = 3;
            for (var n = 0 ; n < 6 ; n++)
            {
                str = String("201" + String(year) + "-" + String(month));
                datasets.push({ period: str, licensed: parseFloat($scope.insurace1data.previouse[counter]).toFixed(2), sorned: parseFloat($scope.insurace2data.previouse[counterp2]).toFixed(2) });
                counter++;
                month++;
                counterp2++;
                if (month == 12)
                {
                    year++;
                    month = 1;
                }
            }
            canDraw = 0;
            counter = 0;

            var predictionsDate = new Date(Date.UTC(2016, 9, 1));
            for (var y = 0 ; y < 6 ; y++)
            {
                str = String("201" + String(year) + "-" + String(month));
                datasets.push({ period: str, licensed: parseFloat($scope.insurace1data.predictions[counter]).toFixed(2), sorned: parseFloat($scope.insurace2data.predictions[counter]).toFixed(2) });
                month++;
                counter++;
                if (month == 12)
                {
                    year++;
                    month = 1;
                }
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
                gridTextSize: 10,
                options: {
                    title: {
                        display: true,
                        text: 'Custom Chart Title'
                    }
                }

            });

        };
    
        /*
            Current month Product Sales
        */

        $scope.viewCurrentMonthProductSales = function ()
        {
            document.getElementById("drawReport").style.visibility = 'visible';

            var html = "";
            html += "<div class='form-group'>";
            html += "<label>please enter a time range:</label>";
            html += "";
            html += "<div class='input-group' style='width:270px;'>";
            html += "<div class='input-group-addon'>";
            html += "<i class='fa fa-clock-o'></i>";
            html += "</div>";
            html += "<input type='text' class='form-control pull-right' id='reservation'>";
            html += "</div>";
            html += "<!-- /.input group -->";
            html += "</div>";


            document.getElementById("itemList").innerHTML = html;

            //Date range picker
            $('#reservation').daterangepicker();

            turnOnMainList("btnViewCurrentMonth");
            $scope.reportName = "Monthly Sales";
            $scope.shortdescription = "The graph below displays the current month’s sales for each product. Sales are in Rands";
            document.getElementById("insertCanvas").innerHTML = "<div  class='chart' id='canvasData' style='height:385px;width:840px;marign-left:29px;'></div>";
            
            

            document.getElementById("drawReport").onclick = function ()
            {
                var textAreaValue = document.getElementById("reservation").value;
                var startDatestr = String(textAreaValue).split("-")[0];
                var endDatestr = String(textAreaValue).split("-")[1];

               

                var start  =new Date (startDatestr);
                var end = new Date(endDatestr);
                $scope.reportName = "Monthly Sales From " + startDatestr.split("/")[2] + "-" + startDatestr.split("/")[0] + " to " + endDatestr.split("/")[2] + "-"  +endDatestr.split("/")[0];
                
                $scope.shortdescription = "The graph below display monthly sales for the selected period";

                $http(
                {
                    method: 'GET',
                    url: hostaddress +"Reports/getSalesPermonthForRange?start=" + start.toISOString() + "&end=" + end.toISOString(),
                }).then(function (response)
                {

                    var datasetss = [];
                    var labelsX = [];

                    var counter = 0;
                     
                    for (var p in response.data)
                    {
                        response.data[counter].datum += "-01";
                        datasetss.push({ licensed: response.data[counter].sales, period: response.data[counter].datum });
                        labelsX.push(response.data[counter].datum);
                        counter++;
                    }
                    

                    var line = new Morris.Line(
                    {
                        element: 'canvasData',
                        resize: true,
                        data: datasetss,
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

                
                });
                return;
            };

           

            

        };

        var turnOnMainList = function (item)
        {
            var linkedList = document.getElementById("menuList");

            var collection = linkedList.getElementsByTagName("li");

            for (var i = 1 ; i < collection.length ; i++)
            {
                if(collection[i].id !== item)
                    collection[i].className = "";
                else
                    collection[i].className = "active";
            }


        };


        $scope.genPDF = function () {
            html2canvas(document.getElementById('printReport'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("NanoFinReport.pdf");
                }
            });
        };
}]);
