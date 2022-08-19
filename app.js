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

function addEmployee() {
    return inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the employee's first name?",
            validate: nameInput => {
                if (nameInput){
                    return true;
                } else {
                    console.log('Please enter a valid response.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: "What is the employee's last name?",
            validate: nameInput => {
                if (nameInput){
                    return true;
                } else {
                    console.log('Please enter a valid response.');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'roleId',
            message: "What is the employee's role?",
            choices: [
                '1. Lead Accountant',
                '2. Accountant',
                '3. Assistant Sales Director',
                '4. ATRM',
                '5. Salesperson',
                '6. Warehouse Worker',
                '7. Forklift Operator',
                '8. Customer Service Rep'
            ]
        },
        {
            type: 'list',
            name: 'managerId',
            message: "Who is the employee's manager?",
            choices: [
                '1. Michael Scott',
                '2. Darryl Philbin'
            ]
        }
    ])
    .then(response => {
        let roleId;
        let managerId;
        if (response.roleId === '1. Lead Accountant') {
            roleId = 1;
        }
        if (response.roleId === '2. Accountant') {
            roleId = 2;
        }
        if (response.roleId === '3. Assistant Sales Director') {
            roleId = 3;
        }
        if (response.roleId === '4. ATRM') {
            roleId = 4;
        }
        if (response.roleId === '5. Salesperson') {
            roleId = 5;
        }
        if (response.roleId === '6. Warehouse Worker') {
            roleId = 6;
        }
        if (response.roleId === '7. Forklift Operator') {
            roleId = 7;
        }
        if (response.roleId === '8. Customer Service Rep') {
            roleId = 8;
        }
        if (response.managerId === '1. Michael Scott') {
            managerId = 1;
        }
        if (response.managerId === '2. Darryl Philbin') {
            managerId = 2;
        }
        db.query(
            "INSERT INTO employee SET ?",
            {
                first_name: response.firstName,
                last_name: response.last_name,
                role_id: roleId,
                manager_id: managerId
            }
        );
        console.log(`
        ============================
        Employee added successfully!
        ============================
        `);
        mainMenu()
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

