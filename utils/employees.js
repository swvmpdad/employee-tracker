const mainMenu = require("../app");
const db = require("../db/connection");

function viewEmployees() {
    db.query(`
    SELECT employee.id AS ID,
    employee.first_name AS First,
    employee.last_name AS Last,
    department.name AS Dept,
    role.title AS Role,
    role.salary AS Salary,
    manager.first_name AS Manager
    FROM employee
    LEFT JOIN manager
    ON employee.manager_id = manager.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN role
    ON employee.role_id = role.id
    `, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.table(res);
        mainMenu();
    });
};

function addEmployee() {

};

module.exports = { viewEmployees, addEmployee };