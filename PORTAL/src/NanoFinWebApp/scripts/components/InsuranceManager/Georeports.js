﻿angular.module('myApp')
    .controller('geodata', ['$scope', '$http', '$log', function ($scope, $http, $log)
    {

        var map;
        var selectedProduct = 31;
        var monthlylocationMarker = [];
        var provinceName = "";
        var productlist = [];
        var provincialData = [];
        var hostaddress = "https";
        var productNameselected;
        var provinceNameSelected;

        var pieOptions =
               {
                   //Boolean - Whether we should show a stroke on each segment
                   segmentShowStroke: true,
                   //String - The colour of each segment stroke
                   segmentStrokeColor: "#fff",
                   //Number - The width of each segment stroke
                   segmentStrokeWidth: 2,
                   //Number - The percentage of the chart that we cut out of the middle
                   percentageInnerCutout: 50, // This is 0 for Pie charts
                   //Number - Amount of animation steps
                   animationSteps: 100,
                   //String - Animation easing effect
                   animationEasing: "easeOutBounce",
                   //Boolean - Whether we animate the rotation of the Doughnut
                   animateRotate: true,
                   //Boolean - Whether we animate scaling the Doughnut from the centre
                   animateScale: false,
                   //Boolean - whether to make the chart responsive to window resizing
                   responsive: true,
                   // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
                   maintainAspectRatio: true,
                   //String - A legend template
                   legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
               };

        function initMap() {
            document.getElementById('canvas').innerHTML = "<div id='map' style='width:500px;height:460px;margin:0px;'></div>";
            map = new google.maps.Map(document.getElementById('map'),
           {
               center: { lat: -29.126612, lng: 25.543462 },
               mapTypeId: 'terrain',
               zoom: 5
           });
            httpGetAsync(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductList", getProductList);

            var htnl = "<div id='informationBox' style='width:600px;height:460px;'></div>";
            document.getElementById('submenu').innerHTML = htnl;
        }

        function getProductList(responce) {
            productlist = JSON.parse(responce);
        }

        var drawMonthlySales = function () {
            document.getElementById('canvas').innerHTML = "";
            map = null;
        };


        function extractLatlng(str) {
            var latlng = String(str).split(",");
            var myLatLng = { lat: parseInt(latlng[0]), lng: parseInt(latlng[1]) };
            return myLatLng;
        }

        var monthlyLocationSales = function () {
            initMap();
            var responce = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getCurrentMonthlyLocationSalesSum");
            arr = JSON.parse(responce);
            var heatmapData = [];

            for (i = 0; i < arr.length; i++) {
                var myLatLng = extractLatlng(arr[i].LatLng);
                var note = String(arr[i].city) + " R" + arr[i].sales;

                var marker = new google.maps.Marker(
                {
                    position: myLatLng,
                    map: map,
                    title: note,
                    snippet: "marker" + arr[i].Location_ID
                });

                var latLng = new google.maps.LatLng(myLatLng.lat, myLatLng.lng);
                heatmapData.push(latLng);

                marker.addListener('click', drawData);
            }

            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatmapData,
                dissipating: false,
                map: map
            });


        };

        function drawData() {
            var locID = String(this.snippet).replace("marker", "");
            var req = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getCurrentMonthLocationProductSalesDistribution?locationID=" + locID);

            monthlysalesinforBox(JSON.parse(req), this.title);
            locationLineGraph(locID);
            toggleBounce(this);
        }


        var monthlysalesinforBox = function (arr, title) {
            var html = "";
            //alert(arr);
            html = "";

            html += "<div class='box box-widget widget-user' style='width:97%;color:black;margin:1px;border:1px 3399FF;'>";
            html += "<div class='box-header bg-aqua'>";
            html += "<h3 class='box-title'>Top 5 Popular Products at " + title.split(" ")[0] + "</h3>";
            html += "";
            html += "<div class='box-tools pull-right'>";
            html += "<button type='button' class='btn btn-box-tool' style='color:white;' data-widget='collapse'><i class='fa fa-minus'></i>";
            html += "</button>";
            html += "";
            html += "</div>";
            html += "</div>";
            html += "";
            html += "<div class='box-footer no-padding'>";
            html += "<ul class='nav nav-pills nav-stacked' style='font-size:15px;width:95%;'>";
            var ic = 0;
            for (ic = 0; ic < arr.length && ic < 5; ic++) {
                arr[ic].sales = arr[ic].sales + 0.10;

                html += "<li>" + arr[ic].productName + "<span class='pull-right text-green'><i class='fa fa-angle-up'></i> R " + arr[ic].sales.toMoney() + " </span></li>";
            }
            html += "<li><br/> </li>";
            html += "</ul>";
            html += "</div>";
            html += "</div>";
            html += "";

            html += "<div class='box box-solid ' style='margin:1px;width:97%'>";
            html += "<div class='box-header bg-aqua'>";
            html += "<i class='fa fa-th'></i>";
            html += "";
            html += "<h3 class='box-title'>Sales Graph</h3>";

            html += "<div class='box-tools pull-right'>";
            html += "<button type='button' class='btn bg-aqua btn-sm' data-widget='collapse'><i class='fa fa-minus'></i>";
            html += "</div>";
            html += "</div>";
            html += "<div class='box-body border-radius-none'>";
            html += "<div class='chart' id='line-chart' style='height: 226px;'></div>";
            html += "</div>";
            html += "</div>";

            document.getElementById('informationBox').innerHTML = html;
        };

        var locationLineGraph = function (locationID) {
            var sales = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getAllLocationSales?locationID=" + locationID);
            var data = JSON.parse(sales);
            var datasets = [];
            var counter = 1;
            var year = 5;
            var quarter = 1;
            var insert = 3;
            var index = 0;
            var date;
            var month = 1;

            if (data.length >= 10) {
                index = data.length - 9;
                month = 1;
            }
            else {
                //index = 9 - data.length;
                month = 10 - data.length;
            }

            for (var r in data) {
                date = "2016-" + month + "-01";
                datasets.push({ y: date, item1: data[index], item2: data[index] });
                month++;
                index++;
            }

            var line = new Morris.Line({
                element: 'line-chart',
                resize: true,
                data: datasets,
                xkey: 'y',
                ykeys: ['item1'],
                labels: ['sales in ZAR'],
                //lineColors: ['#efefef'],
                lineWidth: 2,
                hideHover: 'auto',
                //gridTextColor: "#fff",
                gridStrokeWidth: 0.4,
                pointSize: 4,
                // pointStrokeColors: ["#efefef"],
                // gridLineColor: "#efefef",
                gridTextFamily: "Open Sans",
                gridTextSize: 10
            });

        };

        var ProvincialSales = function () {
            initMap();
            var responce = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/get_PP_ProvincialSales");
            var arr = JSON.parse(responce);

            for (i = 0; i < arr.length; i++) {
                var latlng = String(arr[i].LatLng).split(",");
                var myLatLng = { lat: parseInt(latlng[0]), lng: parseInt(latlng[1]) };
                var note = String(arr[i].Province) + " R" + arr[i].sales;

                var marker = new google.maps.Marker(
                 {
                     position: myLatLng,
                     map: map,
                     title: note,
                     snippet: "marker" + arr[i].Province
                 });

                marker.addListener('click', provincialMarkerClick);
            }
            var res = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProvincialProductType");
            provincialData = JSON.parse(res);
        };

        function provincialMarkerClick() {
            provinceNameSelected = this.title;
            var locID = String(this.snippet).replace("marker", "");
            drawProvincialPieGrapg(locID);

            toggleBounce(this);
        }



        var drawProvincialPieGrapg = function (id) {
            var html = "<div id='informationBox' style='width:570px;height:600px;'></div>";
            document.getElementById('submenu').innerHTML = html;

            html = "<div class='box box-info'>";
            html += "<div class='box-header with-border'>";
            html += "<h3 class='box-title' style='color:black;'>" + provinceNameSelected + "</h3>";

            html += "</div>";
            html += "<div class='box-body' style='height:450px;'>";
            html += "<canvas id='pieChart' style='height:450px;'></canvas>";
            html += "</div>";
            html += "</div>";

            document.getElementById('informationBox').innerHTML = html;

            var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
            var pieChart = new Chart(pieChartCanvas);
            var PieData = [];

            var colors = ["#f56954", "#00a65a", "#f39c12", "#00c0ef", "#3c8dbc", "#d2d6de"];
            var colourCounter = 0;

            for (i = 0; i < provincialData.length; i++) {
                if (provincialData[i].Province === id) {

                    PieData.push({
                        value: provincialData[i].sales,
                        color: colors[colourCounter],
                        highlight: colors[colourCounter],
                        label: provincialData[i].insuranctTypeDescription + " Sold Worth R "
                    });
                    colourCounter++;
                }
            }


            //Create pie or douhnut chart
            // You can switch between pie and douhnut using the method below.
            pieChart.Doughnut(PieData, pieOptions);
        };


        var ProductLocatioinSales = function () {
            initMap();
            drawProductsModal();
        };


        function drawProductsModal() {
            arr = productlist;

            var html = "";
            var index = 0;

            html += "<div class='modal fade' tabindex='-1' id='processApplicationModal' role='dialog' aria-labelledby='gridSystemModalLabel'>";
            html += "<div class='modal-dialog' role='document'>";
            html += "<div class='modal-content'>";
            html += "<div class='modal-header bg-aqua'>";
            html += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
            html += "<h4 class='modal-title' id='gridSystemModalLabel'>Please Select A Product</h4>";
            html += "</div>";
            html += "<div class='modal-body'>";

            for (index = 0; index < arr.length - 1; index++) {
                html += "<div class='row'>";
                html += "<div  class='col-sm-5' style='margin:7px;'";
                html += "<label><input type='radio' name='r3' id='checked" + arr[index].Product_ID + "' class='flat-red' checked>" + arr[index].name + "</label>";
                html += "</div>";
                index++;
                html += "<div  class='col-sm-5' style='margin:7px;'";
                html += "<label><input type='radio'  name='r3' id='checked" + arr[index].Product_ID + "' class='flat-red' checked>" + arr[index].name + "</label>";
                html += "</div>";
                index++;
                html += "</div";
                html += "";
            }

            html += "</div>";
            html += "<div class='modal-footer'>";
            html += "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>";
            html += "<button type='button' id='submitSelectProductModal' class='btn btn-primary'>Save changes</button>";
            html += "</div>";
            html += "</div><!-- /.modal-content -->";
            html += "</div><!-- /.modal-dialog -->";
            html += "</div><!-- /.modal -->";

            document.getElementById("insertModal").innerHTML = html;
            $('#processApplicationModal').modal('show');

            document.getElementById("submitSelectProductModal").onclick = function () {
                var radios = document.getElementsByClassName("flat-red");

                for (var i = 0, length = radios.length; i < length; i++) {
                    if (radios[i].checked) {
                        getAndDrawSelectProduct(productlist[i].Product_ID);
                        $('#processApplicationModal').modal('hide');
                        return;
                    }
                }
            };

            //Flat red color scheme for iCheck
            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        }

        function getAndDrawSelectProduct(productID) {
            //alert(productID);
            responce = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getProductLocationExpenditure?productID=" + productID);
            arr = JSON.parse(responce);
            selectedProduct = productID;
            for (i = 0; i < arr.length; i++) {
                var latlng = String(arr[i].LatLng).split(",");
                var myLatLng = { lat: parseInt(latlng[0]), lng: parseInt(latlng[1]) };
                var note = String(arr[i].Province) + " " + arr[i].city + ",  R" + arr[i].sales;

                var marker = new google.maps.Marker(
                  {
                      position: myLatLng,
                      animation: google.maps.Animation.DROP,
                      map: map,
                      title: note,
                      snippet: "marker" + arr[i].Location_ID
                  });

                marker.addListener('click', function () {
                    var locID = String(this.snippet).replace("marker", "");
                    productNameselected = this.title;
                    drawProductLocationInformation(locID);

                    // document.getElementById("header").innerHTML =
                    toggleBounce(this);
                });
            }
        }


        var drawProductLocationInformation = function (locID) {
            res = httpGet(hostaddress + "://nanofinapibeta.azurewebsites.net/api/ReportsMaster/getDemographicProductLocationLastMonthSales?productID=" + selectedProduct + "&locationsID=" + locID);
            data = JSON.parse(res);

            var numConsumers = 0;

            for (var i = 0 ; i < data.length ; i++)
                numConsumers += data[i].numConsumers;

            var html = "<br /> <br/>";
            html += "<div class='row'>";
            for (i = 0 ; i < data.length && i < 3 ; i++) {
                html += "<div class='col-sm-8'>";
                html += "<div class='info-box'>";
                html += "<span class='info-box-icon bg-aqua' style='height:117px;'><i class='fa fa-group'></i></span>";
                html += "<div class='info-box-content' style='color:black;'>";
                html += "#Consumers  <b style='margin-left:95px;'>" + data[i].numConsumers + "</b><br/>";
                html += "Group Contribution <b style='margin-left: 58px'>R" + data[i].sales + "</b><br/>";
                html += "Employment status <b style='margin-left: 56px'>" + data[i].employmentStatus + "</b><br/>";
                html += "Marital status <b style='margin-left: 89px'>" + data[i].maritalStatus + "</b><br/>";
                html += "Gender    <b style='margin-left: 126px'>" + data[i].gender + "</b><br/>";
                html += "Avg netincome    <b style='margin-left: 84px'>R" + data[i].netIncome + "</b><br/>";

                html += "</div>";
                html += "  </div> ";
                html += "</div> <br /><br />";
            }
            html += "</div>";

            var head = "<h4 class='box-title' style='color:black;'>";
            var stucture = "<div id='informationBox' style='width:570px;height:460px;'> " + head + productNameselected + "</h4></div>";
            document.getElementById('submenu').innerHTML = stucture;
            document.getElementById('informationBox').innerHTML += html;
        };



        /*
            Utility Functions
        */
        function httpGetAsync(theUrl, callback) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                    callback(xmlHttp.responseText);
            };
            xmlHttp.open("GET", theUrl, true); // true for asynchronous
            xmlHttp.send(null);
        }

        function httpGet(theUrl) {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open("GET", theUrl, false); // false for synchronous request
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }


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