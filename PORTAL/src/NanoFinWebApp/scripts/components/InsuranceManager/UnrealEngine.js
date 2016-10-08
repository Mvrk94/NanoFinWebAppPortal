angular.module('myApp')
.controller('dataAnalytics', ['$scope', '$http', '$compile', function ($scope, $http, $compile) 
{

    var originalData = [];
    var filteredData = [];

    var isfilteringGender = { isFilter: false, value: "All" ,type: "gender" , possibleValues: ["Male" , "Female"]};
    var isfilteringMaritalStatus = { isFilter: false, value: "All", type: "maritalStatus", possibleValues: ["Married", "Single"] };
    var isfilteringEmploymentStatus = { isFilter: false, value: "All", type: "employmentStatus", possibleValues: ["Employed", "Unemployed"] };
    var isfilterinhAgeGroup = { isFilter: false, value: "All" , type : "ageGroup" ,possibleValues: [2,12,22,32] };
    var isfilteringRiskCat = { isFilter: false, value: "All", type: "RiskCategory", possibleValues: [1,2,3,4] };

   


    function init()
    {
        originalData = JSON.parse(httpRequest("POST", "http://nanofinapifinal.azurewebsites.net/api/ProcessInsuranceApplications/getUnprocessedApplications"));
        
        for(var  i = 0 ; i < originalData.length ; i++)
        {
            filteredData.push(originalData[i]);
        }
        document.getElementById("btnRefresh").onclick = function ()
        {
            isfilteringGender.value = document.getElementById("cmbGender").value;
            isfilteringEmploymentStatus.value = document.getElementById("cmbEmployment").value;
            isfilteringMaritalStatus.value = document.getElementById("cmbMarital").value;
            isfilterinhAgeGroup.value = document.getElementById("cmbAgeGroup").value;
            isfilteringRiskCat.value = document.getElementById("cmbRiskCat").value;
            FilterAllData();
        };
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
                alert("selected " + filterArr[i].type);
                filteredData = FilterGroup(filteredData, filterArr[i].type, filterArr[i].value);
            }
        }
        drawConsumerReport(filterArr);
    }

    $(document).ready(function () {
        init();
        drawConsumerReport();
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
        drawBarGraph("ConsumerReportGender", "ConsumerReportMaritalBarChart", "Gender ", "gender", isfilteringGender.possibleValues, isfilteringGender.possibleValues);
    }
    function drawConsumerMaritalStatusReports()
    {
        clearGraphCanvas("ConsumerReportMarital");
        if (isfilteringMaritalStatus.isFilter) return;
        drawBarGraph("ConsumerReportMarital", "consumerMaritalBarChart", "Marital Status", "maritalStatus", isfilteringMaritalStatus.possibleValues, isfilteringMaritalStatus.possibleValues);
    }
    function drawConsumerEmployedReports()
    {
        clearGraphCanvas("ConsumerReportEmployment");
        if (isfilteringEmploymentStatus.isFilter) return;
        drawBarGraph("ConsumerReportEmployment", "consumerEmploymentBarChart", "Employment Status", "employmentStatus", isfilteringEmploymentStatus.possibleValues, isfilteringEmploymentStatus.possibleValues);
    }
    function drawConsumerAgeGroupReports()
    {
        clearGraphCanvas("ConsumerReportAge");
        if (isfilterinhAgeGroup.isFilter) return;
        var labels = ["18-25", "26-30", "31-39", "40-60"];
        drawBarGraph("ConsumerReportAge", "ConsumerReportAgeBarChart", "Age Group", "ageGroup", isfilterinhAgeGroup.possibleValues, labels);
    }
    function drawConsumerRiskCatReports()
    {
        clearGraphCanvas("RiskCatReportMarital");
        if (isfilteringRiskCat.isFilter) return;
        var labels = ["Low", "Moderate", "High", "Very-High"];
        drawBarGraph("RiskCatReportMarital", "RiskCatReportMaritalBarChart", "Risk Category", "RiskCategory", isfilteringRiskCat.possibleValues, labels);
    }
    /*
        RISK REPORTS
    */
    


    /*
        UNITILITY LIBRARY
    */

    function AddGraphHtml(chartTitle, chartID) {
        var html = "";
        html += "<div class='box box-primary'>";
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

    function drawBarGraph(elementID, graphID, title, type, possibleValues, labelName) {
        document.getElementById(elementID).innerHTML = AddGraphHtml(title, graphID);
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
}]);