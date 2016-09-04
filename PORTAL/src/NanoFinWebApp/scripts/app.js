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
        title: ' home',
        templateUrl: '/views/components/InsuranceManager/viewiunprocessedapplications.html',
        controller: 'insuranceApplicationsPageController'
    })
    .when('/Reports',
    {
        title: 'reports',
        templateUrl: '/views/components/InsuranceManager/reports.html',
    })
    .when('/validate',
    {
        title: 'validate',
        templateUrl: '/views/components/home/validatorUsers.html',
    })

   .when('/test',
    {
        title: 'validate',
        templateUrl: '/views/components/test/test.html',
    })
     .when('/mapLocation',
    {
        title: 'maps',
        templateUrl: '/views/components/test/GeoReports.html',
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