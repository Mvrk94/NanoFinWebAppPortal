angular.module('myApp')
    .controller('processApplications', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

        var table;
        var unprocessedList;
        var lastPolicyDOc;
        var id;
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
                            { 'data': 'activeProductID' },
                            { 'data': 'customerIDNo' },
                            { 'data': 'customerName' },
                            { 'data': 'address' },
                            { 'data': 'InsurnceName' },
                            { 'data': "startdate" }
                        ]
                    });
        });


        /*   var apiHandler =
        function (url, methode, jsonStorage)
        {
        $http(
       {
           method: 'GET',
         url: 'http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/getUnprocessedApplications?ProductProviderID=11'
       })
       .then(successCallBack(resonce,, errorCallBack);
       // }*/


        var errorCallBack = function (response) {
            $scope.uprocessedApplications = response.data;
        };
        var successCallBack = function (response,storage) {
            unprocessedList = response.data.unprocessed;
            lastPolicyDOc = response.data.lastestPolicyNo;
            table.rows.add(unprocessedList);
            table.draw();
            alert("data");
            addRowHandlers();
        };
        $http(
        {
            method: 'GET',
            url: 'http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/getUnprocessedApplications?ProductProviderID=11'
        })
        .then(successCallBack, errorCallBack);
       
        function addRowHandlers()
        {
            var table = document.getElementById("tblApplications");
            var rows = table.getElementsByTagName("tr");
            for (i = 1; i < rows.length - 1; i++)
            {
                var currentRow = table.rows[i];
                var createClickHandler =
                    function (row)
                    {
                        return function () {
                            var cell = row.getElementsByTagName("td")[0];
                            var id = cell.innerHTML;
                            $scope.viewModal(id);
                        };
                    };

                currentRow.onclick = createClickHandler(currentRow);
            }
        }

        $scope.viewModal = function (index)
        {

            if (index === null) return;
            var unprocessedApplication = findID(index);
            $scope.selectedApplication = unprocessedApplication;
            //alert(lastPolicyDOc);
            var html = "";
            html += "<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>";
            html += "<div class='modal-dialog' role='document'>";
            html += "<div class='modal-content'>";
            html += "<div class='modal-header'>";
            html += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
            html += "<h4 class='modal-title' id='myModalLabel'>" + unprocessedApplication.customerName + "'s Insurance Application </h4>";
            html += "</div>";
            html += "<div class='modal-body'>";
            html += "<div class='row'> <div class='col-sm-5 col-sm-push-6'>    <p style='text-align: right'><strong>Lastest Policy#:" + lastPolicyDOc + " </strong<></p> </div></div>";
            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<label for='txtIDno' class='col-sm-3 control-label'>ID</label>";
            html += "<div class='col-sm-8'>";
            html += "<input type='text' class='form-control' value='" + unprocessedApplication.customerIDNo + "' disabled>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<label for='txtAddress' class='col-sm-3 control-label'>Address</label>";
            html += "<div class='col-sm-8'>";
            html += "<input type='text' class='form-control' id='txtAddress' value='" + unprocessedApplication.address + "' disabled>";
            html += "</div>";
            html += "<br />";
            html += "</div>";
            html += "</div>";

            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<label for='txtProductPurchase' class='col-sm-3 control-label'>Product Purchased</label>";
            html += "<div class='col-sm-8'>";
            html += "<input type='text' class='form-control' id='txtProductPurchase' value='" + unprocessedApplication.InsurnceName + "' disabled>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<div class='row'>";
            html += "<div class='form-group'>";
            html += "<br />";
            html += "<label for='txtStartDate' class='col-sm-3 control-label'>Product Purchased</label>";
            html += "<div class='col-sm-8'>";
            html += "<input type='text' class='form-control' id='txtStartDate' value='" + unprocessedApplication.startdate + "' disabled>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "<div class='row'>";
            html += "<br />";
            html += "<div id='frmPolicyDoc' class='form-group'>";
            html += "<label for='txtPolicyNo' class='col-sm-3 control-label'>Assign Policy No</label>";
            html += "<div class='col-sm-8'>";
            html += "<input type='text' class='form-control' id='txtPolicyNo'>";
            html += "<div id='txtError'></div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            html += "</div>";
            html += "<div class='modal-footer'>";
            html += "<div class='row'>";
            html += "<div class='col-sm-4 '>";
            html += "<button type='button' class='btn btn-danger ' data-dismiss='modal'>Decline Application</button>";
            html += "</div>";

            html += "<div class='col-sm-4 col-sm-push-4'>";
            html += "<button type='button' id='btnModalApprove' class='btn btn-success'>Approve Application</button>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</div>";

            $("#processApplicationModal").html(html);
            $("#myModal").modal();
            document.getElementById("txtPolicyNo").required = true;

            var invalidInput = function (errormessage) {
                document.getElementById("frmPolicyDoc").className = " form-group has-error";
                document.getElementById("txtError").innerHTML = " <span class='help-block'>"+errormessage+"</span>";
            };

            var modalButton = document.getElementById("btnModalApprove");
            modalButton.onclick = function ()
            {
                var newPolicyNo = document.getElementById("txtPolicyNo").value;
                if (newPolicyNo === "") { invalidInput("please enter a policy number"); return; }

                $http(
               {
                   method: 'GET',
                   url: "http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/isPolicyNumberUnique?policyNo=" + newPolicyNo
               }).then(function (responce)
               {
                       if (responce.data == false)
                       {

                           invalidInput("The policy number entered already exist");
                       }
                       else
                       {
                           var processApp =
                           {
                               "providerID": 11,
                               "activeproductID": id,
                               "policyNo": newPolicyNo.toString(),
                           };

                           //var progressBar = "<div class='progress-bar progress-bar-green' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' style='width: 40%'>";
                           //progressBar += "style='width: 40%'>";
                           //progressBar += "  </div>";
                           //document.getElementById("txtError").innerHTML = $compile(progressBar)($scope);
                           //document.getElementById("btnModalApprove").Enabled = false;

                           var req =
                            {
                                method: 'POST',
                                url: 'http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/ProcessInsuranceProduct',
                                headers:{'Content-Type': 'application/json; charset=UTF-8'},
                                data: JSON.stringify(processApp)
                            };
                           $http(req).then(
                               function (responce)
                               {
                                   if (Boolean.valueOf(responce.data) === true)
                                       alert("happy!!!");
                                   $('#myModal').modal('hide');

                               });

                       }
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



       
    }]);
