angular.module('myApp')
    .controller('loginCtrl', ['$scope', '$http', function ($scope, $http)
    {
        $scope.login = function ()
        {
            alert("I am an alert box!");
        };

    }]);  
