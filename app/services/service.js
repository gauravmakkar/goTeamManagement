/**
 * Created by Gaurav MphRx on 2/22/2017.
 */
angular.module('myApp.service', []).factory("employee", function () {

    var Employee = function (id, name, team, designation, table) {
        this.id = id
        this.name = name
        this.team = team
        this.designation = designation
        this.table = table
    }
    var employee_list = []

    var create_employees = function () {
        employee_list.push(new Employee(1, "John", "A", "Software Engineer", {id: 1, seat: 1}))
        employee_list.push(new Employee(2, "Bob", "A", "Sr. Software Engineer", {id: 1, seat: 2}))
        employee_list.push(new Employee(3, "Ram", "B", "Test Engineer", {id: 2, seat: 3}))
        employee_list.push(new Employee(4, "Mohan", "B", "Sr. Test Engineer", {id: 2, seat: 4}))
        employee_list.push(new Employee(5, "Rock", "C", "Product Manager", {id: 4, seat: 3}))
    }
    create_employees()
    var findEmployeeById = function (id) {
        var found_employee = employee_list.filter(function (employee) {
            return employee.id == id
        })
        return found_employee.length > 0 ? found_employee[0] : {}
    }
    var findEmployeeByTable = function (table) {
        var found_employee = employee_list.filter(function (employee) {
            return employee.table.id == table.id && employee.table.seat == table.seat
        })
        return found_employee.length > 0 ? found_employee[0] : {}
    }
    var editEmployee = function (id, newEmployee) {
        var employee = findEmployeeById(id)
        if (employee) {
            employee.name = newEmployee.name
            employee.team = newEmployee.team
            employee.designation = newEmployee.designation
            employee.table = newEmployee.table
        }
        return employee
    }
    var list = function () {
        return employee_list
    }
    // editEmployee(2,{id:2,name:"Boby",team:"A",designation:"Sr. Software Engineer",table:2})
    return {list: list, findEmployeeByTable: findEmployeeByTable, editEmployee: editEmployee}

}).filter("findEmployeeByTableSeat", function (employee) {
    return function (employeeList, table) {
        return employee.findEmployeeByTable(table)
    }
}).directive("setEmployee", function (employee) {
    return {
        restrict: "A",
        scope: true,
        link: function (scope, element, attrs) {
            scope.employee = employee.findEmployeeByTable({id: scope.table.id, seat: scope.seat})
            if (scope.employee) {
                element[0].addEventListener('dragstart', scope.handleDragStart, false);
                element[0].addEventListener('dragend', scope.handleDragEnd, false);
                element[0].addEventListener('drop', scope.handleDrop, false);
                element[0].addEventListener('dragover', scope.handleDragOver, false);
            }


        },
        controller: function ($scope) {
            $scope.handleDragStart = function (e) {
                if (!$scope.employee || !$scope.employee.id) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    this.style.opacity = '0.4';
                    e.dataTransfer.setData('json', JSON.stringify($scope.employee));
                }

            };

            $scope.handleDragEnd = function (e) {
                this.style.opacity = '1.0';
            };

            $scope.handleDrop = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var updatedEmployee = JSON.parse(e.dataTransfer.getData('json'));
                updatedEmployee.table.id = $scope.table.id
                updatedEmployee.table.seat = $scope.seat
                $scope.employee = employee.editEmployee(updatedEmployee.id, updatedEmployee)
                $scope.$apply()

            };

            $scope.handleDragOver = function (e) {
                e.preventDefault(); // Necessary. Allows us to drop.
                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            };
        }
    }
})