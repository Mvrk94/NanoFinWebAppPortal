angular.module('myApp')
.controller('consumerGroups', ['$scope', '$http', '$compile', function ($scope, $http, $compile)
{
    function drawNode(temp)
    {
        var html = "";
        html += "<div class='col-md-4'>";
        html += "<div class='box box-default  box-solid'>";
        html += "<div class='box-header bg-teal with-border'>";
        html += "<h3 class='box-title'>" + temp.alias + " </h3>";
        html += "<div class='box-tools pull-right'>";
        html += "<button type='button' class='btn btn-box-tool' data-widget='collapse'>";
        html += "<i class='fa fa-plus'></i>";
        html += "</button>";
        html += "</div>";
        html += "<!-- /.box-tools -->";
        html += "</div>";
        html += "";
        html += "<div class='box-body '>";

        html += "<label > Selected Fields:</label>";
        html += "<ul class='nav nav-pills nav-stacked'>";
        html += "<li><a>";
        html += "<i class='fa  fa-transgender'></i>Gender";
        html += "<span class='pull-right'>" + temp.gender + "</span>";
        html += "</a>";
        html += "</li>";
        html += "";
        html += "<li><a>";
        html += "<i class='fa  fa-industry'></i>Employment Status";
        html += "<span class='pull-right'>" + temp.employmentStatus + "</span>";
        html += "</a>";
        html += "</li>";
        html += "";
        html += "";
        html += "<li>";
        html += "<a>";
        html += "<i class='fa fa-group'></i>Marital Status";
        html += "<span class='pull-right '>" + temp.maritalStatus + "</span>";
        html += "</a>";
        html += "</li>";

        html += "<li>";
        html += "<a>";
        html += "<i class='fa fa- fa-clock-o'></i>Age Group";
        html += "<span class='pull-right '>" + temp.agegroup + "</span>";
        html += "</a>";
        html += "</li>";

        html += "<li>";
        html += "<a>";
        html += "<i class='fa fa-exclamation-triangle'></i> Risk Category";
        html += "<span class='pull-right '>" + temp.riskCat + "</span>";
        html += "</a>";
        html += "</li>";

        html += "</ul>";
        html += "</div>";
        html += "<!-- /.box-body -->";
        html += "";
        html += "<div class='box-footer'>";


        html += "<div class='row'>";


        html += "<div class='col-sm-12'>";
        html += "<a href='DataAnalityics?vid=" + temp.idconsumerGroups + "'><button type='button' class='btn btn-block btn-default'>Engage with Clients </button></a>";
        html += "</div>";

        //html += "<div class='col-sm-6'>";
        //html += "<a href='DataAnalityics?vid=" + temp.idconsumerGroups + "'><button type='button' class='btn btn-block btn-default'>View More</button></a>";
        //html += "</div>";

        //html += "<div class='col-sm-6'>";
        //html += "<a><button type='button' class='btn btn-block btn-default' id='btnMessage" + temp.idconsumerGroups + "'>Send Message</button></a>";
        //html += "</div>";

        html += "</div>";
        
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
        var responce = JSON.parse(httpRequest("GET", "http://nanofinapifinal.azurewebsites.net/api/ConsumerProfiles/getConsumerGroups"));
        var html = "";

        for (var i = 0 ; i < responce.length ; i++)
        {
            var temp = responce[i];
            html += drawNode(temp);
        }
        document.getElementById("consumerGroups").innerHTML = html;

        //for (i = 0 ; i < responce.length ; i++)
        //{
        //    document.getElementById("btnMessage" + responce[i].idconsumerGroups).onclick = runModal;
        //}

    }


    function runModal(event)
    {
        var id = String(this.id).replace("btnMessage", "");
        //alert(this.id);
        var html = "";
        html += "<div class='modal fade' tabindex='-1' id='processApplicationModal' role='dialog' aria-labelledby='gridSystemModalLabel'>";
        html += "<div class='modal-dialog' role='document'>";
        html += "<div class='modal-content'>";
        html += "<div class='modal-header bg-aqua'>";
        html += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
        html += "<h4 class='modal-title' id='gridSystemModalLabel'>Product Name</h4>";
        html += "</div>";
        html += "<div class='modal-body' style='height:200px'>";

        html += "<small> please enter a message that will be sent all the consumers in this group. </small> <br/>";
        html += "<div class='form-group'>";
        html += "<br/><label  class='col-sm-2  control-label'>Message</label>";
        html += "<div class='col-sm-10'>";
        html += "<textarea class='form-control'  style='height:119px'  ></textarea>";
        html += "</div>";
        html += "</div>";

        html += "</div>";
        html += "<div class='modal-footer'>";
        html += "<span class='pull-left'><button type='button' class='btn btn-danger' data-dismiss='modal'>Close</button></span>";
        html += "<button type='button' id='submitSelectProductModal"+id+"'  class='btn btn-primary'>Send Message</button>";
        html += "</div>";
        html += "</div><!-- /.modal-content -->";
        html += "</div><!-- /.modal-dialog -->";
        html += "</div><!-- /.modal -->";

        document.getElementById("insertModal").innerHTML = html;
        $('#processApplicationModal').modal('show');


        document.getElementById("submitSelectProductModal" +  id).onclick = function ()
        {
            var btnID = String(this.id).replace("submitSelectProductModal", "");
            //alert(btnID);
        };
    }

    
     init();
}]);
