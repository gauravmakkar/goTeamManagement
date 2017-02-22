/**
 * Created by Gaurav MphRx on 2/22/2017.
 */
'use strict';

angular.module('seating.dashboard.controller', ['ngRoute', 'seating.service'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/table/dashboard', {
            templateUrl: 'table/dashboard.html',
            controller: 'TableDashboardCtrl'
        });
    }])

    .controller('TableDashboardCtrl', ['$scope', 'employee', function ($scope, employee) {
        $scope.employees={}
        $scope.employees.list = employee.list()

        $scope.tables = [{id: 1, seats: [1, 2, 3, 4]}, {id: 2, seats: [1, 2, 3, 4]}, {
            id: 3,
            seats: [1, 2, 3, 4]
        }, {id: 4, seats: [1, 2, 3, 4]}, {id: 5, seats: [1, 2, 3, 4]}, {id: 6, seats: [1, 2, 3, 4]}]

    }])
    