const inquirer = require('inquirer');
const db = require('./db/connection');



function viewEmployees() {
    db.query(`
    SELECT employee.id AS ID,
    employee.first_name AS First,
    employee.last_name AS Last,
    role.title AS Role,
    role.salary AS Salary,
    manager.first_name AS Manager
    FROM employee
    LEFT JOIN manager
    ON employee.manager_id = manager.id
    LEFT JOIN role
    ON employee.role_id = role.id;
    `, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.table(res);
        mainMenu();
    });
};

function mainMenu() {
    console.log(`
██████████████████████████████████████████████████
█▄─▄▄─█▄─▀█▀─▄█▄─▄▄─█▄─▄███─▄▄─█▄─█─▄█▄─▄▄─█▄─▄▄─█
██─▄█▀██─█▄█─███─▄▄▄██─██▀█─██─██▄─▄███─▄█▀██─▄█▀█
▀▄▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▀▀▄▄▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▄▄▀
███████████████████████████████████████████
█─▄─▄─█▄─▄▄▀██▀▄─██─▄▄▄─█▄─█─▄█▄─▄▄─█▄─▄▄▀█
███─████─▄─▄██─▀─██─███▀██─▄▀███─▄█▀██─▄─▄█
▀▀▄▄▄▀▀▄▄▀▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▄▀▄▄▀▄▄▀
    `);
    return inquirer
    .prompt([
        {
        type: 'list',
        name: 'menu',
        message: 'What would you llike to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'View Departments',
            'Add Department',
            'View Managers',
            'Add Manager',
            'View All Roles',
            'Add Role',
            'Update Employee Role',
            'Quit'
        ]
        }
    ])
    .then(response => {
        if (response.menu === 'View All Employees') {
            viewEmployees();
        }
        else if (response.menu === 'Add Employee') {
            addEmployee();
        }
        else if (response.menu === 'View Departments') {
            viewDepartments();
        }
        else if (response.menu === 'Add Department') {
            addDepartment();
        }
        else if (response.menu === 'View Managers') {
            viewManagers();
        }
        else if (response.menu === 'View All Roles') {
            viewRoles();
        }
        else if (response.menu === 'Add Role') {
            addRole();
        }
        else if (response.menu === 'Update Employee Role') {
            updateRole();
        }
        else if (response.menu === 'Add Manager') {
            addManager();
        }
        else if (response.menu === 'Quit') {
            console.log(`            
░██████╗░░█████╗░░█████╗░██████╗░██████╗░██╗░░░██╗███████╗██╗
██╔════╝░██╔══██╗██╔══██╗██╔══██╗██╔══██╗╚██╗░██╔╝██╔════╝██║
██║░░██╗░██║░░██║██║░░██║██║░░██║██████╦╝░╚████╔╝░█████╗░░██║
██║░░╚██╗██║░░██║██║░░██║██║░░██║██╔══██╗░░╚██╔╝░░██╔══╝░░╚═╝
╚██████╔╝╚█████╔╝╚█████╔╝██████╔╝██████╦╝░░░██║░░░███████╗██╗
░╚═════╝░░╚════╝░░╚════╝░╚═════╝░╚═════╝░░░░╚═╝░░░╚══════╝╚═╝
            `);
        }
    });
}

db.connect(function(err) {
    if (err) {
        console.log(err);
    }
    console.log('Connected to database!');

    mainMenu();
});

module.exports = mainMenu;

