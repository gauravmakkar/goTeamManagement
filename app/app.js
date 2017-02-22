'use strict';

// Declare app level module which depends on views, and components
angular.module('seating', [
  'ngRoute',
  'seating.service',
  'seating.dashboard.controller','ui.bootstrap'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/table/dashboard'});
}]);
