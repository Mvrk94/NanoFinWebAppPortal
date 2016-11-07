/// <reference path="../../../wwwroot/assets/plugins/datatables/jquery.datatables.min.js" />
/// <reference path="../../../wwwroot/assets/plugins/datatables/jquery.datatables.js" />


angular.module('myApp')
    .controller('processBatchApplications', ['$scope', '$http', '$compile','$window', function ($scope, $http, $compile,$window) {

        var table;
        var unprocessedList;
        var lastPolicyDOc;
        var id;
        var selectedCons = 11;
        var hostaddress = "https://nanofinapifinal.azurewebsites.net/api/";
        angular.element(document).ready(function ()
        {
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
                            { 'data': 'icon' },
                            { 'data': 'idConsumer' },
                            { 'data': 'clientName' },
                            { 'data': 'numUnprocessed' },
                            { 'data': "riskDescription" },
                            { 'data': "options" }
                        ]
                });

        });



        var errorCallBack = function (response) {
            $scope.uprocessedApplications = response.data;
        };
        var successCallBack = function (response)
        {
            unprocessedList = response.data;
            var counter = 0;
            for (var r in unprocessedList)
            {
                unprocessedList[counter].riskDescription = "";
                var riskCat = unprocessedList[counter].RiskCategory;
                if (riskCat == 1)
                {
                    unprocessedList[counter].icon = "<i class='fa fa-fw fa-user' style='color:green;'></i> ";
                    unprocessedList[counter].riskDescription = "Low Risk";
                }
                else if (riskCat  == 2)
                {
                    unprocessedList[counter].icon = "<i class='fa fa-fw fa-user' style='color:yellow;'></i> ";
                    unprocessedList[counter].riskDescription = "Moderate Risk";

                }
                else if (riskCat == 3)
                {
                    unprocessedList[counter].icon = "<i class='fa fa-fw fa-user' style='color:orange;'></i> ";
                    unprocessedList[counter].riskDescription = "High Risk";

                }
                else
                {
                    unprocessedList[counter].icon = "<i class='fa fa-fw fa-user' style='color:red;'></i> ";
                    unprocessedList[counter].riskDescription = "Very High Risk";

                }
                unprocessedList[counter].options = generateBtn(unprocessedList[counter].idConsumer);
                counter++;
            }
            
            table.rows.add(unprocessedList);
            table.draw();

            $('#tblApplications').on('draw.dt', function (evet)
            {
                createButtonEvents();
            });
            
            createButtonEvents();

        };
        $http(
        {
            method: 'POST',
            url: hostaddress + 'ProcessInsuranceApplications/getUnprocessedApplications'
        })
        .then(successCallBack, errorCallBack);
       
        function addRowHandlers(event)
        {
            id = String(this.id).replace("btnView", "");
            selectedCons = id;
                $scope.viewModal(id);
        }

        var createButtonEvents = function ()
        {
            var table1 = document.getElementById("tblApplications");
            var rows = table1.getElementsByTagName("tr");
            for (i = 1; i < rows.length; i++)
            {
                var currentRow = table1.rows[i];
                var cell = currentRow.getElementsByTagName("td")[1];
                id = cell.innerHTML;
                //document.getElementById("btnView" + id).onclick = addRowHandlers;
                document.getElementById("btnProcess" + id).onclick = redirectToClientPage;
            }
        };

        function redirectToClientPage(event)
        {
            var cid = String(this.id).replace("btnProcess", "");
            $window.location.href = '/ProcessSingleApplication?cid='+  cid;
        }

        $scope.viewModal = function (index)
        {

            var user = findConsumerApp(index);
            var html = "";
            html += "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>";
            html += "<div class='modal-dialog' role='document' style='width:700px;height:700px;'>";
            html += "<div class='modal-content'>";
            html += "<div class='modal-header'>";
            html += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
            html += "<h4 class='modal-title' id='myModalLabel'><strong>Applicant No #" + user.idConsumer + "</strong></h4>";
            html += "</div>";
            html += "<div class='modal-body'>";
            html += "<div class='row'>";
            html += "<br/>";
            html += "<div class='col col-sm-6'>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<label for='txtIDno' class='col-sm-6 control-label'>Age Group :</label>";
            html += "<div class='col-sm-6'>" + getAgeCat(user.ageGroup) + "</div>";
            html += "<br />";
            html += "<div class='col-sm-10'>";
            html += "<label id='txtIDno' class='col-sm-9 control-label'>+" + user.ageRiskValue + " Risk-Load</label>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<div class='col col-sm-6'>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<label for='txtAddress' class='col-sm-6 control-label'>Gender :</label>";
            html += "<div  class='col-sm-6'>" + user.gender+"</div>";
            html += "<br />";
            html += "<div class='col-sm-10'>";
            html += "<label id='txtAddress' class='col-sm-9 control-label'>+" + user.genderRiskValue + " Risk-Load</label>";
            html += "</div>";
            html += "<br />";
            html += "</div>";
            html += "</div>";
            html += "</div>";


            html += "<div class='col col-sm-6'>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<label for='txtProductPurchase' class='col-sm-6 control-label'>Marital Status :</label>";
            html += "<div class='col-sm-6'>" + user.maritalStatus + "</div>";
            html += "<br />";
            html += "<div class='col-sm-10'>";
            html += "<label id='txtProductPurchase' class='col-sm-9 control-label'>+" + user.maritalStatusRiskValue + " Risk-Load</label>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<div class='col col-sm-6'>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<label for='txtStartDate' class='col-sm-6 control-label'>Claim Rate :</label>";
            html += "<div class='col-sm-6'>" + user.claimRate + "%</div>";
            html += "<br />";
            html += "<div class='col-sm-10'>";
            html += "";
            html += "<label id='txtStartDate' class='col-sm-9 control-label'>+" + user.claimRate + " Risk-Load</label>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<br />";
            html += "<div class='col col-sm-6'>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<div class='col-sm-6 control-label'><strong>Work Status :</strong></div>";
            html += "<div  class='col-sm-6'>" + user.employmentStatus + "</div>";
            html += "<br />";
            html += "<div class='col-sm-10'>";
            html += "<label id='txtStartDate' class='col-sm-9 control-label'>+" + user.employmentStatusRiskValue + " Risk-Load</label>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";




            html += "</div>";

            html += "<hr /> ";
            html += "<h4><strong>Products Await Approval</strong></h4>";
            html += "<small> please select the products you wish process </small>";
            html += "<br />";

            var list = String(user.purchasedProducts).split(";");
            var idList = String(user.purchasedProductIDs).split(";");
            for (index = 0; index < list.length; index++)
            {
                html += "<div class='row'>";
                html += "<div  class='col-sm-5' style='margin:7px;'";
                html += "<label><input type='checkbox' id='checkbox"+ idList[index] + "' class='flat-red'><i class='fa fa-fw fa-shopping-cart'></i> " + list[index] + "</label>";
                html += "</div>";
                index++;
                if (index >= list.length)
                {
                    html += "</div";
                    break;
                }
                html += "<div  class='col-sm-5' style='margin:7px;'";
                html += "<label><input type='checkbox' id='checkbox" + idList[index] + "' class='flat-red'><i class='fa fa-fw fa-shopping-cart'></i> " + list[index] + "</label>";
                html += "</div>";
                html += "</div";
                html += "";
            }
            html += "<br />";
            html += "<br />";
            html += "<br />";
            html += "<br />";
            html += "</div>";
            html += "<div class='modal-footer'>";
            html += "<div class='row'>";
            html += "<div class='col-sm-4 '>";
            html += "<button type='button' class='btn btn-danger ' data-dismiss='modal'>Close Application</button>";
            html += "</div>";

            html += "<div class='col-sm-4 col-sm-push-4'>";
            html += "<button type='button' id='btnModalApprove" + user.idConsumer + "' class='btn btn-success'>Approve Application</button>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            $("#processApplicationModal").html(html);
            $("#myModal").modal();

            $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck
           ({
               checkboxClass: 'icheckbox_flat-green',
           });

            

            var modalButton = document.getElementById("btnModalApprove" + user.idConsumer);
            modalButton.onclick = function ()
            {
                var buttonID = String(this.id).replace("btnModalApprove", "");
                findConsumerApp(buttonID);
                var idList = String(user.purchasedProductIDs).split(";");
                for(var i  = 0 ; i <  idList.length ; i++)
                {
                    var check = document.getElementById("checkbox" + idList[i]).checked;

                    if (check)
                    {
                        $http(
                        {
                            method: 'POST',
                            url: hostaddress + "ProcessInsuranceApplications/ProcessSingleApplication?activeProductID=" + idList[i],
                        });
                    }
                }
                table.clear();
    
                $http(
                {
                    method: 'POST',
                    url: hostaddress + 'ProcessInsuranceApplications/getUnprocessedApplications'
                })
                .then(function(responce)
                {
                    successCallBack(responce);
                    $('#myModal').modal('hide');
                });
                

            };
        };

        function findID(insuranceProductID)
        {
            for (var r = 0 ; r < unprocessedList.length ; r++)
            {
                if (unprocessedList[r].activeProductID == insuranceProductID) 
                {
                    id = insuranceProductID;
                    return unprocessedList[r];
                }
            }
        }

        function  generateBtn(id)
        {
            var html = "<div class='btn-group'>";
            //html += "<button type='button' id='btnView" + id + "' class='btn btn-default '><i class='fa fa-info' style='color:blue;'></i></button>";
            html +="<button type='button' id='btnProcess" + id + "' class='btn btn-default'>Process</button>";
            html +="</div>";
            return html;
        }

        function findConsumerApp(ID)
        {
            var i = 0;
            for(var r  in  unprocessedList)
            {
                if (unprocessedList[i].idConsumer == ID)
                {
                    return unprocessedList[i];
                }
                i++;
            }

            return unprocessedList[0];
        }


        function getAgeCat(id)
        {
            if (2 == id)
                return "18-25";
            else if (12 == id)
                return "26-30";
            else if (22 == id)
                return "31-49";
            else if (32 == id)
                return "40-60";
        }
        
   

       
    }]);
