
angular.module('myApp')
    .directive('fileInput', ['$parse', function ($parse) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('change', function () {//on change event bind this element to the model
                    $parse(attrs.fileInput)
                    .assign(scope, element[0].files);
                    scope.$apply();
                });
            }
        };
    }])
    .controller('processClaimsCtrl', ['$scope', '$http', '$compile', '$window', '$log', '$routeParams', function ($scope, $http, $compile, $window, $log, $routeParams) {
        $scope.apiBaseUrl = 'http://nanofinapifinal.azurewebsites.net';

        var CID = location.search.split('cid=')[1];
        $scope.claimID = CID;
       
        $scope.claimForm = '';
        $scope.nothingsBeenSelected = true;
        $scope.showClaimForm = false;
        $scope.showDoc = false;

        $scope.StatusNotFinalized = false;
       

        $scope.claimEntity = {
            Claim_ID: 0,
            ActiveProductItems_ID: 0,
            capturedClaimFormDataJson: "string",
            claimDate: "2016-10-15T18:07:24.507Z",
            claimStatus: "null",
            claimPaymentFinalised: "false",
           Consumer_ID: 0
        };

        $scope.uploading = false;

        var getSingleClaimToBeProcessed = function () {
            $http({
                method: 'GET',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/getSingleClaimToBeProcessed?claimID=' + $scope.claimID
            })
              .then(function (response) {
                  var vClaimToBeProcessed = response.data;
                  $scope.ClaimToBeProcessed = vClaimToBeProcessed;
                  $scope.claimForm = angular.fromJson(vClaimToBeProcessed.capturedClaimFormData);
                  $scope.firstStepFields = $scope.claimForm[0].fields;
                  $scope.secondStepFields = $scope.claimForm[1].fields;

                  $scope.claimID = vClaimToBeProcessed.claimID;
                  $scope.claimDate = vClaimToBeProcessed.claimDate;
                  $scope.consumerName = vClaimToBeProcessed.consumerName;
                  $scope.consumerSurname = vClaimToBeProcessed.consumerSurname;
                  $scope.activeProdID = vClaimToBeProcessed.activeProductID;
                  $scope.productName = vClaimToBeProcessed.productName;
                  $scope.claimStatus = vClaimToBeProcessed.claimStatus;
                  $scope.claimPaymentFinalised= vClaimToBeProcessed.claimPaymentFinalised;
                  $scope.consumerContactNumber = vClaimToBeProcessed.contactNumber;


                  $log.info(response);

              }, function (reason) {
                  $log.info(reason);
              });
        };

        getSingleClaimToBeProcessed();

        $scope.viewClaimForm = function () {
            $scope.nothingsBeenSelected = false;
            $scope.showDoc = false;
            $scope.showClaimForm = true;
        };

      

        //get this claim's uploaded documents
        var getClaimDocsPath = function () {
            $http({
                method: 'GET',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/getClaimUploadedDocsPath?ClaimID=' + $scope.claimID
            })
             .then(function (response) {
                 var vClaimDocsPath = response.data;
                 $scope.claimDocsPath = vClaimDocsPath;
                 $scope.claimDocsLongPath = 'http://nanofinapifinal.azurewebsites.net' + vClaimDocsPath;

                        //get the files inside this directory
                         $http({
                             method: 'GET',
                             url: 'http://nanofinapifinal.azurewebsites.net/api/FileUpload/getFileInfoInDirectory?filepath=' + $scope.claimDocsPath
                         })
                            .then(function (response) {
                                var vClaimDocs = response.data;
                                $scope.claimDocumentsInDir = vClaimDocs;

                                $log.info(response);

                            }, function (reason) {
                                $log.info(reason);
                            });

                $log.info(response);

             }, function (reason) {
                 $log.info(reason);
             });

        };
        getClaimDocsPath();



        $scope.showDocPreview = function (filename) {
            $scope.currentDocPath = $scope.claimDocsLongPath +'/'+ filename;
            $scope.nothingsBeenSelected = false;
            $scope.showClaimForm = false;
            $scope.showDoc = true;
        };

        var fd = new FormData();
        $scope.upload = function (files) {
            $scope.uploading = true;
            

            console.log(files);

            if(files.length===0)
            {
                alert("No files selected!");
                $scope.uploading = false;
                return;
            }
            //check file size of all files //and extensions
            for (var i = 0; i < files.length; i++) {
                var fsize = files.item(i).size;//size of file
                console.log('file size:' + fsize);

                if ((fsize / 1024) >= 2048) {
                    $scope.showMaxFileSizeAlert();
                    $scope.uploading = false;
                    return;
                }

                var fileExtension = $scope.getFileExt(files.item(i).name);

                if(fileExtension ==='exe')
                {
                    alert("Don't allow this file type!");
                    $scope.uploading = false;
                    return;
                }
            }

            angular.forEach(files, function (value, key) {
                fd.append(key, value);
            });
            $http.post($scope.apiBaseUrl + '/api/FileUpload/uploadToNewDirectory?strDirectory=claims/' + $scope.productName + "/" + $scope.activeProdID, fd,
                {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (d) {
                    $scope.uploading = false;
                    alert("Files uploaded successfully!");
                    console.log(d);
                }).error(function () {
                    $scope.uploading = false;
                    alert("Failed!");
                });

        };

        $scope.showMaxFileSizeAlert = function () {
            alert("The size of one or more files is more than 2 MiB, please try again");

        };

        $scope.getFileExt = function (string) {
            var array = string.split('.');
            return array[1];
        };

        //$(document).ready(function () {
        //    $("#myBtn").click(function () {
        //        $("#myModal").modal();
        //    });
        //});
       

        $scope.submitClaimProcess = function ()
        {
            $scope.submitLoading = true;

            $http({
                method: 'PUT',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/updateClaimStatus?ClaimID=' + $scope.claimID + '&status=' + $scope.claimEntity.claimStatus
            }).then(function (response)
            {

                $log.info(response);
            }, function (reason) {

                $log.info(reason);
            });


            $http({
                method: 'PUT',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/updateClaimPaymentStatus?ClaimID=' + $scope.claimID + '&paymentStatus=' + $scope.claimEntity.claimPaymentFinalised
            }).then(function (response) {

                $log.info(response);


            }, function (reason) {

                $log.info(reason);
            });




            if($scope.claimEntity.claimStatus === "Rejected")
            {
                $scope.rejected = true;
                $scope.modalHeader = "Claim Rejected";
                $scope.modalMessage = "A notification message will be sent to the user";
                $("#myModal").modal();

                // send sms to user to notify of rejected claim
                $http({
                    method: 'POST',
                    url: 'http://nanofinapifinal.azurewebsites.net/api/Notification/SendSMS?toPhoneNum=' + $scope.consumerContactNumber + '&message=' + "Your claim for: " + $scope.productName +" reference number: "+ $scope.claimID +$scope.activeProdID + " has been rejected, 2Help1 will contact you shortly. "
                })
                .then(function (response) {
                    console.log("sent sms to: " + $scope.consumerContactNumber + "with message: " + message);
                    $log.info(response);
                }, function (reason) {
                    console.log("failed to send sms");
                    $log.info(reason);
                });                     
            }
            if ($scope.claimEntity.claimStatus === "Accepted")
            {
                $scope.rejected = false;
                $scope.modalHeader = "Claim Accepted";
                $scope.modalMessage = "This claim will be marked as accepted and the supplied proof documentation will be made available to the user.";
                $("#myModal").modal();

            }
            //if ($scope.claimEntity.claimStatus === "Accepted" && $scope.claimEntity.claimPaymentFinalised === false) {
            //    $scope.rejected = false;
            //    $scope.modalHeader = "Claim Accepted but waiting for finalising of payment";
            //    $scope.modalMessage = "This claim will be marked as accepted, but remain on the list of claims that need further processing.";
            //    $("#myModal").modal();

            //}

            if ($scope.claimEntity.claimStatus === "In Progress") {
                $scope.rejected = false;
                $scope.modalHeader = "Claim still In Progress";
                $scope.modalMessage = "This claim will remain on the list of claims that need further processing.";
                $("#myModal").modal();

            }

            


          
        };

        $scope.isClaimStatusRejectedOrInProg = function ()
        {
            if ($scope.claimEntity.claimStatus === "Rejected" || $scope.claimEntity.claimStatus === "In Progress" || $scope.claimEntity.claimStatus==="null") {
                return true;
            }
            else
            {
                return false;
            }
        };

        $scope.modalDismissed = function ()
        {
            //write to db the claimStatus and Payment Finalized

         

            window.location = "/viewClaims";

        };

        $scope.genPDF = function ()
        {
            html2canvas(document.getElementById('claimfrm'), {
                onrendered: function (canvas) {
                    var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 500,
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download("#" + $scope.claimID + $scope.activeProdID + ".pdf");
                }
            });           
        }; 

    }]);
