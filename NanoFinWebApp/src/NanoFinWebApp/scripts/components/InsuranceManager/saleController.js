angular.module('myApp')
    .controller('reportsController', ['$scope', '$http', '$compile', function ($scope, $http, $compile) {

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
                            { 'data': 'index' },
                            { 'data': 'month' },
                            { 'data': 'NumberofPurchases' },
                            { 'data': 'unitsSold' },
                            { 'data': 'OverallSales' },
                        ]
                });
        });

        var errorCallBack = function (response) {
            $scope.uprocessedApplications = response.data;
        };
        var successCallBack = function (response) {
            unprocessedList = response.data;
            table.rows.add(unprocessedList);
            table.draw();
            alert("data");
        };
        $http(
        {
            method: 'GET',
            url: 'http://nanofinapi.azurewebsites.net/api/Reports/getInvoices?providerID=11'
        })
        .then(successCallBack, errorCallBack);

    }]);
