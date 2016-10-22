angular.module('myApp')
.controller('dataAnalytics', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
{




    function drawNode(alias, attributesArr ,date, consumerNum, salestrend ,cliamRate)
    {
        var html = "";
        html += "<div class='col-md-4'>";
        html += "<div class='box box-default  box-solid'>";
        html += "<div class='box-header with-border'>";
        html += "<h3 class='box-title'>"+ alias+" </h3>";
        html += "<div class='box-tools pull-right'>";
        html += "<button type='button' class='btn btn-box-tool' data-widget='collapse'>";
        html += "<i class='fa fa-plus'></i>";
        html += "</button>";
        html += "</div>";
        html += "<!-- /.box-tools -->";
        html += "</div>";
        html += "";
        html += "<div class='box-body '>";

        html += "<div class='form-group'>";
        html += "<label for='exampleInputEmail1'> Selected Fields:</label>";
        html += "<div id='exampleInputEmail1' class='row'>";

        for (var i = 0 ; i < attributesArr.length ; i++)
        {
            html += writeAttributes(attributesArr[i]);
        }
        //html += "<div class='col-md-4'><i class='fa fa-female'></i>Female</div>";
        //html += "<div class='col-md-4'><i class='fa fa-group'></i>Employed</div>";
        //html += "<div class='col-md-4'><i class='fa fa-exclamation-triangle'></i>High Risk</div>";
        html += "</div>";
        html += "</div>";

        html += "<br />";
        html += "<ul class='nav nav-pills nav-stacked'>";
        html += "<li><a>";
        html += "Last Updated";
        html += "<span class='pull-right'>"+ date +"</span>";
        html += "</a>";
        html += "</li>";
        html += "";
        html += "<li><a>";
        html += "#Consumers in Group";
        html += "<span class='pull-right'>"+ consumerNum+"</span>";
        html += "</a>";
        html += "</li>";
        html += "";
        html += "";
        html += "<li>";
        html += "<a>";
        html += "Claim Rate";
        html += "<span class='pull-right text-red'><i class='fa fa-angle-down'></i> " + cliamRate + "%</span>";
        html += "</a>";
        html += "</li>";
        html += "</ul>";
        html += "</div>";
        html += "<!-- /.box-body -->";
        html += "";
        html += "<div class='box-footer'>";
        html += "<a href='"+ id +"'><button type='button' class='btn btn-block btn-default'>View More</button></a>";
        html += "</div>";
        html += "</div>";
        html += "<!-- /.box -->";
        html += "</div>";

        return html;
    }

    function httpRequest(methode, theUrl)
    {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open(methode, theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }
    
    function init()
    {
        var responce = JSON.parse(httpRequest("POST", "get consumer profiles"));
        var html = "";

        for (var i = 0 ; i < responce.length ; i++)
        {
            html += drawNode();
        }

    }
}]);

