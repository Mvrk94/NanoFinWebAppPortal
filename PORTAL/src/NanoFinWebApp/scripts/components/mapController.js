angular.module('myApp')
        .controller('mapController', ['$scope', '$http', 'NgMap', function ($scope, $http, NgMap)
        {
            $scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDaVSsJenH6dgcBdRY4pWilPBFIDTsY8us";
            NgMap.getMap().then(function(map) 
            {
                //console.log(map.getCenter());
                //console.log('markers', map.markers);
                //console.log('shapes', map.shapes);
            });
        }]);