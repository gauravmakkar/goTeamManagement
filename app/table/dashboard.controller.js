/**
 * Created by Gaurav MphRx on 2/22/2017.
 */
'use strict';

angular.module('myApp.dashboard.controller', ['ngRoute', 'myApp.service'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/table/dashboard', {
            templateUrl: 'table/dashboard.html',
            controller: 'TableDashboardCtrl'
        });
    }])

    .controller('TableDashboardCtrl', ['$scope', 'employee', function ($scope, employee) {
        $scope.employees = employee.list

        $scope.tables = [{id: 1, seats: [1, 2, 3, 4]}, {id: 2, seats: [1, 2, 3, 4]}, {
            id: 3,
            seats: [1, 2, 3, 4]
        }, {id: 4, seats: [1, 2, 3, 4]}, {id: 5, seats: [1, 2, 3, 4]}, {id: 6, seats: [1, 2, 3, 4]}]

        $scope.editEmployeePosition = function (emply) {
            employee.editEmployee(emply.id, {
                name: emply.name + ' changed',
                designation: emply.designation,
                team: emply.team,
                table: {id: 2, seat: 1}
            })
        }
    }])
    .controller("EmployeeDetailsController", ['$scope', 'employee', function ($scope, employee) {
        // console.log($scope.table)
        $scope.employee = employee.findEmployeeByTable({id: $scope.table.id, seat: $scope.seat})
    }]);