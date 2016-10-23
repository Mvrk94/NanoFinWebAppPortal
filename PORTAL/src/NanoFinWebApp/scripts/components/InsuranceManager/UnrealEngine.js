angular.module('myApp')
.controller('dataAnalytics', ['$scope', '$http', '$compile', function ($scope, $http, $compile) 
{
    var selectedGroup;
    var VID = 0;
    var originalData = [];
    var filteredData = [];
    var preferences = [];
    var isfilteringGender = { isFilter: false, value: "All" ,type: "gender" , possibleValues: ["Male" , "Female"]};
    var isfilteringMaritalStatus = { isFilter: false, value: "All", type: "maritalStatus", possibleValues: ["Married", "Single"] };
    var isfilteringEmploymentStatus = { isFilter: false, value: "All", type: "employmentStatus", possibleValues: ["Employed", "Unemployed"] };
    var isfilterinhAgeGroup = { isFilter: false, value: "All" , type : "ageGroup" ,possibleValues: [2,12,22,32] };
    var isfilteringRiskCat = { isFilter: false, value: "All", type: "RiskCategory", possibleValues: [1,2,3,4] };

    
    /*
     CHART-JS GRAPH OPTIONS
 */
    var areaChartOptions = {
        //Boolean - If we should show the scale at all
        showScale: true,
        //Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines: false,
        //String - Colour of the grid lines
        scaleGridLineColor: "rgba(0,0,0,.05)",
        //Number - Width of the grid lines
        scaleGridLineWidth: 1,
        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,
        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,
        //Boolean - Whether the line is curved between points
        bezierCurve: true,
        //Number - Tension of the bezier curve between points
        bezierCurveTension: 0.3,
        //Boolean - Whether to show a dot for each point
        pointDot: false,
        //Number - Radius of each point dot in pixels
        pointDotRadius: 4,
        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth: 1,
        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius: 20,
        //Boolean - Whether to show a stroke for datasets
        datasetStroke: true,
        //Number - Pixel width of dataset stroke
        datasetStrokeWidth: 2,
        //Boolean - Whether to fill the dataset with a color
        datasetFill: true,
        //String - A legend template
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
        //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true
    };
    var pieOptions = {
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
    var barChartOptions = {
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


    function init()
    {
        originalData = JSON.parse(httpRequest("GET", "http://nanofinapifinal.azurewebsites.net/api/ConsumerProfiles/getConsumerProfileData"));
        preferences = JSON.parse(httpRequest("GET", 'http://nanofinapifinal.azurewebsites.net/api/ConsumerProfiles/getPreferencesReports'));

        VID = location.search.split('vid=')[1];

        if (VID == parseInt(VID))
        {
           selectedGroup = JSON.parse(httpRequest("GET","http://nanofinapifinal.azurewebsites.net/api/ConsumerProfiles/getSingleConsumerGroup?consumerGroupID=" +VID));

           setValue("cmbGender", selectedGroup.gender);
           setValue("cmbEmployment", selectedGroup.employmentStatus);
           setValue("cmbMarital", selectedGroup.maritalStatus);
           setValue("cmbAgeGroup", selectedGroup.agegroup);
           setValue("cmbRiskCat", selectedGroup.riskCat);

           var html = "<br/>";
           //html += "<div class='row'>";

           html += "<div class='col col-sm-2 col-sm-push-5' style='margin-top:0px;'><br/>";
            html += "<button type='button' id='savechanges' class='btn btn-block btn-info'> Update</button>";
            html += "</div>";

            html += "<div class='col col-sm-2 col-sm-push-5'><br/>";
            html += "<button type='button' id='sendMessage' class='btn btn-block btn-info'> Engage With Consumers </button>";
            html += "</div>";
           //html += "";
          // html += "</div>";
         //  html += "</div>";

           document.getElementById("options").innerHTML = html;
            update();
        }

        for(var  i = 0 ; i < originalData.length ; i++)
        {
            filteredData.push(originalData[i]);
        }

        for( i = 0 ; i <preferences.length ; i++)
            preferences[i].count  = 0;
        document.getElementById("btnRefresh").onclick = update;
    }

    function update()
    {
        isfilteringGender.value = document.getElementById("cmbGender").value;
        isfilteringEmploymentStatus.value = document.getElementById("cmbEmployment").value;
        isfilteringMaritalStatus.value = document.getElementById("cmbMarital").value;
        isfilterinhAgeGroup.value = document.getElementById("cmbAgeGroup").value;
        isfilteringRiskCat.value = document.getElementById("cmbRiskCat").value;
        FilterAllData();
    }

    function FilterAllData()
    {
        isfilteringGender.isFilter = (isfilteringGender.value === "All") ? false : true;
        isfilteringEmploymentStatus.isFilter = (isfilteringEmploymentStatus.value === "All") ? false : true;
        isfilteringMaritalStatus.isFilter =  (isfilteringMaritalStatus.value === "All") ? false : true;
        isfilterinhAgeGroup.isFilter = (isfilterinhAgeGroup.value === "All") ? false : true;
        isfilteringRiskCat.isFilter = (isfilteringRiskCat.value === "All") ? false : true;
    
        var filterArr = [ isfilteringGender, isfilteringMaritalStatus, isfilteringEmploymentStatus, isfilterinhAgeGroup, isfilteringRiskCat ];
        filteredData = [];
        for (var c = 0 ; c < originalData.length ; c++) 
            filteredData.push(originalData[c]);

        for(var  i  = 0 ; i <  filterArr.length ; i++)
        {
            if(filterArr[i].isFilter)
            {
                filteredData = FilterGroup(filteredData, filterArr[i].type, filterArr[i].value);
            }
        }
        drawConsumerReport(filterArr);
        drawRiskReports();
        drawPerformencesReports();
    }

    $(document).ready(function () {
        init();
        drawConsumerReport();
        drawRiskReports();
        monthConsumerGroupExpenditure();
        popularProducts();
    });

    /*
        CONSUMER REPORTS
    */
    function drawConsumerReport(filterArr)
    {
        drawConsumerGenderReports();
        drawConsumerMaritalStatusReports();
        drawConsumerEmployedReports();
        drawConsumerAgeGroupReports();
        drawConsumerRiskCatReports();
    }
    function drawConsumerGenderReports()
    {
        clearGraphCanvas("ConsumerReportGender");
        if (isfilteringGender.isFilter) return;
        drawBarGraph("ConsumerReportGender", "ConsumerReportMaritalBarChart", "#Consumers per Gender ", "gender", isfilteringGender.possibleValues, isfilteringGender.possibleValues);
    }
    function drawConsumerMaritalStatusReports()
    {
        clearGraphCanvas("ConsumerReportMarital");
        if (isfilteringMaritalStatus.isFilter) return;
        drawBarGraph("ConsumerReportMarital", "consumerMaritalBarChart", "#Consumers per Marital Status", "maritalStatus", isfilteringMaritalStatus.possibleValues, isfilteringMaritalStatus.possibleValues);
    }
    function drawConsumerEmployedReports()
    {
        clearGraphCanvas("ConsumerReportEmployment");
        if (isfilteringEmploymentStatus.isFilter) return;
        drawBarGraph("ConsumerReportEmployment", "consumerEmploymentBarChart", "#Consumers per Employment Status", "employmentStatus", isfilteringEmploymentStatus.possibleValues, isfilteringEmploymentStatus.possibleValues);
    }
    function drawConsumerAgeGroupReports()
    {
        clearGraphCanvas("ConsumerReportAge");
        if (isfilterinhAgeGroup.isFilter) return;
        var labels = ["18-25", "26-30", "31-39", "40-60"];
        drawBarGraph("ConsumerReportAge", "ConsumerReportAgeBarChart", "#Consumers per Age Group", "ageGroup", isfilterinhAgeGroup.possibleValues, labels);
    }
    function drawConsumerRiskCatReports()
    {
        clearGraphCanvas("RiskCatReportMarital");
        if (isfilteringRiskCat.isFilter) return;
        var labels = ["Low", "Moderate", "High", "Very-High"];
        drawBarGraph("RiskCatReportMarital", "RiskCatReportMaritalBarChart", "#Consumers per Risk Category", "RiskCategory", isfilteringRiskCat.possibleValues, labels);
    }
    /*
        RISK REPORTS
    */
    //<div id="RiskReportGender"></div>
    //<div id="RiskReportEmployment"></div>
    //<div id="RiskReportAge"></div>
    //<div id="MaritalReportRisk"></div>
    function drawRiskReports()
    {
        drawRiskGenderReports();
        drawRiskMaritalReports();
        drawRiskEmployedReports();
        drawRiskAgeGroupReports();
    }

    function drawRiskGenderReports()
    {
        clearGraphCanvas("RiskReportGender");
        if (isfilteringGender.isFilter) return;
        drawRiskBarGraph("RiskReportGender", "RiskReportGenderBarChart", "Claim Rates(%) per Gender", "gender", isfilteringGender.possibleValues, "claimRate", isfilteringGender.possibleValues);
    }
    function drawRiskAgeGroupReports()
    {
        clearGraphCanvas("RiskReportAge");
        if (isfilterinhAgeGroup.isFilter) return;
        drawRiskBarGraph("RiskReportAge", "RiskReportMaritalBarChart", "Claim Rates(%) per Age Group", "ageGroup", isfilterinhAgeGroup.possibleValues, "claimRate", ["18-25", "26-30", "31-39", "40-60"]);
    }
    function drawRiskMaritalReports()
    {
        clearGraphCanvas("RiskReportMarital");
        if (isfilteringMaritalStatus.isFilter) return;
        drawRiskBarGraph("RiskReportMarital", "MaritalReportRiskBarChart", "Claim Rates(%) per Marital  Status", "maritalStatus", isfilteringMaritalStatus.possibleValues, "claimRate", isfilteringMaritalStatus.possibleValues);
    }
    function drawRiskEmployedReports()
    {
        clearGraphCanvas("RiskReportEmployment");
        if (isfilteringEmploymentStatus.isFilter) return;
        drawRiskBarGraph("RiskReportEmployment", "RiskReportEmploymentBarChart", "Claim Rates(%) per Employment Status", "employmentStatus", isfilteringEmploymentStatus.possibleValues, "claimRate", isfilteringEmploymentStatus.possibleValues);
    }
    
    /*
        UNITILITY LIBRARY
    */

    function AddGraphHtml(chartTitle, chartID,color) {
        var html = "";
        html += "<div class='box box-"+color+"'>";
        html += "<div class='box-header with-border'>";
        html += "<h3 class='box-title'>" + chartTitle + "</h3>";
        html += "<div class='box-tools pull-right'>";
        html += "<button type='button' class='btn btn-box-tool' data-widget='collapse'><i class='fa fa-minus'></i></button>";
        html += "</div>";
        html += "</div>";
        html += "<div class='box-body'>";
        html += "<div class='chart'>";
        //Key
        html += "<canvas id='" + chartID + "' style='height:250px'></canvas>";
        html += "</div>";
        html += "</div>";
        html += "<!-- /.box-body -->";
        html += "</div>";

        return html;
    }

    function FilterGroup(filtered, variableType, request) {
        var temp = [];
        var counter = 0;

        for (var i = 0 ; i < filtered.length ; i++) {
            if (read_prop(filtered[i], variableType) == request)
                temp.push(filtered[i]);
        }
        return temp;
    }

    function countData(filtered, variableType, request) {
        var count = 0;
        for (var i = 0 ; i < filtered.length ; i++) {
            if (read_prop(filtered[i], variableType) == request)
                count++;
        }
        return count;
    }

    function avgData(filtered, variableType, request, valueToAvg)
    {
        var sum = 0;
        for (var i = 0 ; i < filtered.length ; i++)
        {
            if (read_prop(filtered[i], variableType) == request)
                sum += read_prop(filtered[i], valueToAvg);
        }
        return parseFloat( sum/filtered.length).toFixed(2);
    }

    function httpRequest(methode, theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(methode, theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    function read_prop(obj, prop) {
        return obj[prop];
    }

    function  clearGraphCanvas(elementID)
    {
        document.getElementById(elementID).innerHTML = "";
        document.getElementById(elementID).className = "";
    }

    function drawBarGraph (elementID, graphID, title, type, possibleValues, labelName) {
        document.getElementById(elementID).innerHTML = AddGraphHtml(title, graphID,"primary");
        document.getElementById(elementID).className = "col col-md-4";
        var dataset = [];
        var count = 0;
        for (var i = 0 ; i < possibleValues.length ; i++) {
            dataset.push(countData(filteredData, type, possibleValues[i]));
        }

        var barChartCanvas = $("#" + graphID).get(0).getContext("2d");
        var barChart = new Chart(barChartCanvas);
        var barChartData = {
            labels: labelName,
            datasets: [
              {
                  label: labelName,
                  fillColor: "rgba(60,141,188,0.9)",
                  strokeColor: "rgba(60,141,188,0.8)",
                  pointColor: "#3b8bba",
                  pointStrokeColor: "rgba(60,141,188,1)",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(60,141,188,1)",
                  data: dataset
              }
            ]
        };
        barChartOptions.datasetFill = false;
        barChart.Bar(barChartData, barChartOptions);
    }

    function drawRiskBarGraph(elementID, graphID, title, type, possibleValues, valueToAvg, labelName)
    {
        document.getElementById(elementID).innerHTML = AddGraphHtml(title, graphID,"danger");
        document.getElementById(elementID).className = "col col-md-4";
        var dataset = [];
        var count = 0;
        for (var i = 0 ; i < possibleValues.length ; i++) {
            dataset.push(avgData(filteredData, type, possibleValues[i], valueToAvg));
        }

        //var req =
        //    {
        //        method: 'POST',
        //        url: 'http://nanofinapifinal.azurewebsites.net/api/insuranceManager/Postproduct',
        //        headers: {
        //            'Content-Type': 'application/json; charset=UTF-8'
        //        },
        //        data: JSON.stringify(dataset)
        //};

        //$http(req).then(
        //    function (responce, status, headers, config) {
        //        $scope.InsuranceProduct.Product_ID = parseInt(responce.data.Product_ID);
        //    }
        //    );

        
        var barChartCanvas = $("#" + graphID).get(0).getContext("2d");
        var barChart = new Chart(barChartCanvas);
        var barChartData = {
            labels: labelName,
            datasets: [
              {
                  label: labelName,
                  fillColor: "rgba(255,0,0,0.3)",
                  strokeColor: "rgba(255,0,0,0.3)",
                  pointColor: "#3b8bba",
                  pointStrokeColor: "rgba(255,0,0,0.3)",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(255,0,0,0.3)",
                  data: dataset
              }
            ]
        };
        barChartOptions.datasetFill = false;
        barChart.Bar(barChartData, barChartOptions);
    }

    /*
        PERFORMANCE REPORTS 
    */

    function drawPerformencesReports()
    {
        monthConsumerGroupExpenditure();
        popularProducts();
    }

    function convert(item)
    {
        return parseInt(item, 10);
    }

    function monthConsumerGroupExpenditure()
    {

        var datapoints = [0, 0, 0, 0, 0, 0];
        for (var i = 0 ; i < filteredData.length ; i++)
        {
            var temp = filteredData[i].monthPurchases.split(',').map(convert);

            for(var r  = 0; r < temp.length && r < 6 ; r++)
            {
                datapoints[r] += temp[r];
            }
        }

        var graphID = "monthlysales";
        document.getElementById("monthExpenditure").innerHTML = drawLineChart(graphID, "Average monthly sales", "success");

        var dataset = [];

        for (i = 0 ; i < 6 ; i++)
        {
            dataset.push({ y: '2016-0'+i, item1: parseFloat(datapoints[i]/filteredData.length).toFixed(2) });
        }


        var line = new Morris.Line({
            element: graphID,
            resize: true,
            data: dataset,
            xkey: 'y',
            ykeys: ['item1'],
            labels: ['sales'],
            lineColors: ['#3c8dbc'],
            hideHover: 'auto'
        });

    }

    function popularProducts()
    {
        var countIndex = 0;
        for (var i = 0 ; i < preferences.length ; i++)
            preferences[i].count = 0;

        for( i = 0 ;i < filteredData.length ; i++)
        {
            if (String(filteredData[i].topProductCategoriesInterestedIn).split(";").length != 2)break;
            var temp = String(filteredData[i].topProductCategoriesInterestedIn);
            var ids = temp.split(";")[0].split(",").map(convert);
            var pCounts = temp.split(";")[1].split(",").map(convert);

            for (var r = 0 ; r < preferences.length ; r++)
            {
                countIndex = ids.indexOf(preferences[r].Product_ID);
                if(countIndex !=  -1)
                    preferences[r].count += pCounts[countIndex];
            }
        }
       
        preferences.sort(function (a, b) {
            return a.count - b.count;
        });
        monthlysalesinforBox(preferences, "Units Sold per Product", "productName", "count");
    }

    function drawLineChart(graphID, title, cssColor)
    {
        var html = "";
        html += "<div class='box box-"+ cssColor +"'>";
        html += "<div class='box-header with-border'>";
        html += "<h3 class='box-title'>"+title+"</h3>";

        html += "<div class='box-tools pull-right'>";
        html += "<button type='button' class='btn btn-box-tool' data-widget='collapse'><i class='fa fa-minus'></i>";
        html += "</button>";
        html += "</div>";
        html += "</div>";

        html += "<div class='box-body chart-responsive'>";
        html += "<div class='chart' id='" + graphID + "' style='height: 300px;'></div>";

        html += "</div>";
        html += "</div>";

        return html;
    }

    function monthlysalesinforBox(arr, title, param1, param2) {
        var html = "";
        
        html = "";

        html += "<div class='box box-widget widget-user' style='width:97%;color:black;margin:1px;border:1px 3399FF;'>";
        html += "<div class='box-header bg-green'>";
        html += "<h3 class='box-title'> " + title + "</h3>";
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
        for (ic = arr.length -1; ic >= 0; ic--) {
            html += "<li>" + read_prop(arr[ic], param1) + "<span class='pull-right text-green'><i class='fa fa-angle-up'></i> " + read_prop(arr[ic], param2) + " </span></li>";
        }
        html += "<li><br/> </li>";
        html += "</ul>";
        html += "</div>";
        html += "</div>";
        html += "";

        document.getElementById("PurchasedProducts").innerHTML = html;
    }

    function setValue(emementValue, value)
    {
        document.getElementById(emementValue).value = value;
    }

    //one signal
    //var onesignal = require('node-opensignal-api');
    //var onesignal_client = onesignal.createClient();

    //var restApiKey = 'YOUR_APP_REST_API_KEY';  //
    //var params = {
    //    app_id: 'YOUR_APP_ID', //
    //    contents: {
    //        'en': 'NEW PRODUCT BITCHES !!! BUY IT'
    //    },
    //    tags: [{ "key": "custom_tag", "relation": "=", "value": "custom_value" }] //ask if assigned tags
    //};
    //onesignal_client.notifications.create(restApiKey, params, function (err, response) {
    //    if (err) {
    //        console.log('Encountered error', err);
    //    } else {
    //        console.log(response);
    //    }
    //});
}]);