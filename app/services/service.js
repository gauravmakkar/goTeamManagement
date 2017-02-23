/**
 * Created by Gaurav MphRx on 2/22/2017.
 */
angular.module('seating.service', []).factory("employee", function () {

    /**
     * Employee Constructor
     * @param id
     * @param name
     * @param team
     * @param designation
     * @param table
     * @constructor
     */
    var Employee = function (id, name, team, designation, table) {
        this.id = id
        this.name = name
        this.team = team
        this.designation = designation
        this.table = table
    }
    var employee_list = []

    /**
     * Bootstrapping data
     */
    var create_employees = function () {
        employee_list.push(new Employee(1, "John Nash", "A", "Software Engineer", {id: 1, seat: 1}))
        employee_list.push(new Employee(2, "Bob Builder", "A", "Sr. Software Engineer", {id: 1, seat: 2}))
        employee_list.push(new Employee(3, "Ram Kumar Singhania", "B", "Test Engineer", {id: 2, seat: 3}))
        employee_list.push(new Employee(4, "Mohan Singh", "B", "Sr. Test Engineer", {id: 2, seat: 4}))
        employee_list.push(new Employee(5, "Rock Johnson", "C", "Product Manager", {id: 4, seat: 3}))
        employee_list.push(new Employee(6, "Eric Smith", "C", "Chief Technical Officer", {id: 5, seat: 2}))
        employee_list.push(new Employee(7, "Joern Kevin", "C", "Junior Engineer", {id: 6, seat: 3}))
    }

    /**
     * The method will find the employee filtering by its ID
     * @param id
     * @returns {{}}
     */
    var findEmployeeById = function (id) {
        var found_employee = employee_list.filter(function (employee) {
            return employee.id == id
        })
        return found_employee.length > 0 ? found_employee[0] : {}
    }

    /**
     * The method will find the employee based on its Seat
     * @param table
     * @returns {{}}
     */
    var findEmployeeByTable = function (table) {
        var found_employee = employee_list.filter(function (employee) {
            return employee.table.id == table.id && employee.table.seat == table.seat
        })
        return found_employee.length > 0 ? found_employee[0] : {}
    }

    /**
     * The method will used to update the position when an employee position
     * is changed by drag and drop.
     * @param id
     * @param newEmployee
     * @returns {{}}
     */
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
    /**
     * The method will return the
     * list of employees.
     * @returns {Array}
     */
    var list = function () {
        return employee_list
    }

    create_employees()

    return {list: list, findEmployeeByTable: findEmployeeByTable, editEmployee: editEmployee}

}).directive("setEmployee", function (employee) {
    /**
     * The directive will set the draggable and droppable
     * property of the employee
     */
    return {
        restrict: "A",
        scope: true,
        link: function (scope, element, attrs) {
            scope.employee = employee.findEmployeeByTable({id: scope.table.id, seat: scope.seat})
            scope.$watch('employee', function (n, o) {
                if (n && n.id) {
                    element[0].addEventListener('dragstart', scope.handleDragStart, false);
                    element[0].addEventListener('dragend', scope.handleDragEnd, false);
                    element[0].removeEventListener('drop', scope.handleDrop, false);
                    element[0].removeEventListener('dragover', scope.handleDragOver, false);
                } else {
                    element[0].removeEventListener('dragstart', scope.handleDragStart, false);
                    element[0].removeEventListener('dragend', scope.handleDragEnd, false);
                    element[0].addEventListener('drop', scope.handleDrop, false);
                    element[0].addEventListener('dragover', scope.handleDragOver, false);
                }
            })


        },
        controller: function ($scope,$rootScope) {
            $scope.handleDragStart = function (e) {
                if (!$scope.employee || !$scope.employee.id) {
                    e.preventDefault();
                    e.stopPropagation();
                } else {
                    this.style.opacity = '0.4';
                    /**
                     * Since we can't access e.dataTransfer.getData in handleDragEnd
                     * so populating rootsope with the current employee
                     * @type {{}|*|null}
                     */
                    $rootScope.currentEmployee=$scope.employee
                    e.dataTransfer.setData('json', JSON.stringify($scope.employee));
                }

            };

            $scope.handleDragEnd = function (e) {
                var source = $rootScope.currentEmployee
                if (e.dataTransfer.dropEffect != 'none' || (source.table.id != $scope.table.id && source.table.seat != $scope.table.seat)) {
                    $scope.employee = null
                    $scope.$apply()  //Since we're communicating with non angular code, so to update the model, we need to manually run digest cycle.
                }
                this.style.opacity = '1.0';
            };

            $scope.handleDrop = function (e) {
                e.preventDefault();
                e.stopPropagation();
                var updatedEmployee = JSON.parse(e.dataTransfer.getData('json'));
                updatedEmployee.table.id = $scope.table.id
                updatedEmployee.table.seat = $scope.seat
                $rootScope.currentEmployee=null
                $scope.employee = employee.editEmployee(updatedEmployee.id, updatedEmployee)
                $scope.$apply()
                creationNotification(updatedEmployee.name+" has been moved to Table "+updatedEmployee.table.id+" and Seat "+updatedEmployee.table.seat)
            };

            $scope.handleDragOver = function (e) {
                e.preventDefault(); // Necessary. Allows us to drop.
                e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
                return false;
            };
        }
    }
})