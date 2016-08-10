angular.module('myApp')
    .controller('dashboard', ['$scope', '$http', function ($scope, $http) 
    {
        var map;


        angular.element(document).ready(function ()
        {
           
            
        });


        var errorCallBack = function (response)
        {

            $scope.insuranceProductList = response.data;
        };

        var successCallBack = function (response)
        {
            $scope.insuranceProductList = response.data;
            var mapMarkers = [];


                
      mapMarkers.push({ latLng: [43.73, 7.41], name: 'Monaco' });
      mapMarkers.push({ latLng: [-0.52, 166.93], name: 'Nauru' });
      mapMarkers.push({ latLng: [-8.51, 179.21], name: 'Tuvalu' });
      mapMarkers.push({ latLng: [43.93, 12.46], name: 'San Marino' });
      mapMarkers.push({ latLng: [47.14, 9.52], name: 'Liechtenstein' });
      mapMarkers.push({ latLng: [7.11, 171.06], name: 'Marshall Islands' });
      mapMarkers.push({ latLng: [17.3, -62.73], name: 'Saint Kitts and Nevis' });
      mapMarkers.push({ latLng: [3.2, 73.22], name: 'Maldives' });
      mapMarkers.push({ latLng: [35.88, 14.5], name: 'Malta' });
      mapMarkers.push({ latLng: [12.05, -61.75], name: 'Grenada' });
      mapMarkers.push({ latLng: [13.16, -61.23], name: 'Saint Vincent and the Grenadines' });
      mapMarkers.push({ latLng: [13.16, -59.55], name: 'Barbados' });
      mapMarkers.push({ latLng: [17.11, -61.85], name: 'Antigua and Barbuda' });
      mapMarkers.push({ latLng: [-4.61, 55.45], name: 'Seychelles' });
      mapMarkers.push({ latLng: [42.5, 1.51], name: 'Andorra' });
      mapMarkers.push({ latLng: [14.01, -60.98], name: 'Saint Lucia' });
      mapMarkers.push({ latLng: [6.91, 158.18], name: 'Federated States of Micronesia' });
      mapMarkers.push({ latLng: [1.3, 103.8], name: 'Singapore' });
      mapMarkers.push({ latLng: [1.46, 173.03], name: 'Kiribati' });
      mapMarkers.push({ latLng: [-21.13, -175.2], name: 'Tonga' });
      mapMarkers.push({ latLng: [15.3, -61.38], name: 'Dominica' });
      mapMarkers.push({ latLng: [-20.2, 57.5], name: 'Mauritius' });
      mapMarkers.push({ latLng: [26.02, 50.55], name: 'Bahrain' });
      mapMarkers.push({ latLng: [0.33, 6.73], name: 'São Tomé and Príncipe' });
            

            alert(response.data[0].address);
            //for (var i = 0, l = response.data.length; i < l; i++)
            //    mapMarkers.push({ latLng: "[" +response.data[i].address + "]", name: 'Vatican City'  });



            //var markers = [];
            //markers.push({ latLng: mapMarkers });

            $('#world-map-markers').vectorMap({
                map: 'world_mill_en',
                normalizeFunction: 'polynomial',
                hoverOpacity: 0.7,
                hoverColor: false,
                backgroundColor: 'transparent',
                regionStyle: {
                    initial: {
                        fill: 'rgba(210, 214, 222, 1)',
                        "fill-opacity": 1,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 1
                    },
                    hover: {
                        "fill-opacity": 0.7,
                        cursor: 'pointer'
                    },
                    selected: {
                        fill: 'yellow'
                    },
                    selectedHover: {}
                },
                markerStyle: {
                    initial: {
                        fill: '#00a65a',
                        stroke: '#111'
                    }
                },
                markers: mapMarkers
            });
            //mapMarkers.length = 0;

            //for (var i = 0, l = response.data.length; i < l; i++)
            //{
            //    mapMarkers.push({latLng: response.data[i].address });
            //    //mapMarkersValues.push(plants[i].status);
            //}
            //map.createMarkers(mapMarkers);

        };

        $http(
        {
            method: 'GET',
            url: 'http://nanofinapi.azurewebsites.net/api/Reports/getBestReseller'
        })
        .then(successCallBack, errorCallBack);

    }]);
