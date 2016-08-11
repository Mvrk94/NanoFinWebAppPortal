angular.module('myApp')
    .controller('validateUsers', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

        var table;
        var unprocessedList;
        angular.element(document).ready(function () {
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
                            { 'data': 'userID' },
                            { 'data': 'brankNo' },
                            { 'data': 'name' },
                            { 'data': 'IDNumber' },
                            { 'data': 'bankName' },
                            { 'data': 'accountNo' },
                            { 'data': 'address' },
                            { 'data': 'contactInfo' },
                        ]
                });
        });

        var errorCallBack = function (response) {
            $scope.uprocessedApplications = response.data;
        };
        var successCallBack = function (response) {
            unprocessedList = response.data;

            var counter = 0;
            for (var p in unprocessedList)
            {
                unprocessedList[counter].brankNo = "Pending";
                counter++;
            }

            table.rows.add(unprocessedList);
            table.draw();
        };
        $http(
        {
            method: 'GET',
            url: 'http://nanofinapi.azurewebsites.net/api/Validator/getUnValidatedUsers'
        })
        .then(successCallBack, errorCallBack);

    }]);
