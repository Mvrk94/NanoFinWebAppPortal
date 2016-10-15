
angular.module('myApp')
    
    .controller('processClaimsCtrl', ['$scope', '$http', '$compile', '$window', '$log', '$routeParams', function ($scope, $http, $compile, $window, $log, $routeParams) {

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
            claimStatus: "string",
            claimPaymentFinalised: "string",
           Consumer_ID: 0
        };

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

        $scope.uploadFile = function ()
        {
            //upload the file
        };

        $scope.submitClaimProcess = function ()
        {
            //write to db the claimStatus and Payment Finalized
            //if rejected: display modal with user's contact information

        };


    }]);
