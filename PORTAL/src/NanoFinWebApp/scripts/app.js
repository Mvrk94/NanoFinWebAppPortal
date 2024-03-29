﻿var app = angular.module('myApp', ['ngRoute', 'ngMap']);

app.config(function ($routeProvider, $locationProvider) 
{
    $routeProvider
    .when('/', {
        redirectTo: function () {
            return '/home';
        }
    })
    .when('/home', {
        title: 'Insurance Manager',
        templateUrl: '/views/components/InsuranceManager/home.html',
        controller: 'homePageController'

    })

    .when('/ProductManagement', {
        title: 'Insurance Manager',
        templateUrl: '/views/components/InsuranceManager/productManagement.html',
        controller: 'productManagementPageController'
    })
   .when('/Products', {
       title: 'Insurance Manager',
       templateUrl: '/views/components/InsuranceManager/products.html',
       controller: 'productsPageController'
   })

    .when('/addProduct', {
        title: 'Insurance Manager',
        templateUrl: '/views/components/InsuranceManager/AddInsuranceProduct.html',
        controller: 'AddProductPageController'
    })
    .when('/ProcessPurchases', {
        title: 'Process Applications',
        templateUrl: '/views/components/InsuranceManager/processApplicationsWithRisk.html',
        controller: 'insuranceApplicationsPageController'
    })
    .when('/ProcessSingleApplication', {
        title: 'Process Applications',
        templateUrl: '/views/components/InsuranceManager/processConsumerApplications.html',
        controller: 'insuranceApplicationsPageController'
    })

    .when('/DataAnalityics',
    {
        title: 'Data Analytics',
        templateUrl: '/views/components/InsuranceManager/UnrealEngine.html',
        controller: 'insuranceApplicationsPageController'
    })
    .when('/Reports',
    {
        title: 'Reports',
        templateUrl: '/views/components/InsuranceManager/reports.html',
    })
    .when('/validate',
    {
        title: 'Validate',
        templateUrl: '/views/components/home/validatorUsers.html',
    })

   .when('/test',
    {
        title: 'General Reports',
        templateUrl: '/views/components/test/test.html',
    })
     .when('/mapLocation',
    {
        title: 'Geo Reports',
        templateUrl: '/views/components/test/GeoReports.html',
    })
         .when('/viewClaims',
    {
        title: 'View Claims',
        templateUrl: '/views/components/InsuranceManager/viewUnprocessedClaims.html',
    })
         .when('/processClaim', {
             title: 'Process Claim',
             templateUrl: '/views/components/InsuranceManager/processClaim.html',   

         })

     .when('/CreatedProfiles',
    {
        title: 'Consumer Profiles',
        templateUrl: '/views/components/InsuranceManager/consumerProfiles.html',
    })

    .when('/geodata',
    {
        title: 'Consumer Profiles',
        templateUrl: '/views/components/InsuranceManager/GeoVisualization.html',
    })


    .otherwise({
        templateUrl: '/views/components/InsuranceManager/home.html',
        controller: 'homePageController'
    });

    //$locationProvider.html5Mode(false).hashPrefix('!'); // AngularJS Hashbang routing mode
    $locationProvider.html5Mode(true);
});
app.controller('homePageController', ['$scope', function ($scope) {
}]);
app.controller('aboutPageController', ['$scope', function ($scope) {
}]);
app.controller('productManagementPageController', ['$scope', function ($scope) {
}]);
app.controller('productsPageController', ['$scope', function ($scope) {

}]);
app.controller('AddProductPageController', ['$scope', function ($scope) {
}]);
app.controller('contactPageController', ['$scope', function ($scope) {
    $scope.title = "contact";
}]);
app.controller('insuranceApplicationsPageController', ['$scope', function ($scope) {
}]);

app.run(['$rootScope', '$route', function ($rootScope, $route) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
    });
}]);