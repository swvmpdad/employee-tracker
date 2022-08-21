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
            message: `What is the employee's role?
            1. Lead Accountant, 2. Accountant, 3. Assistant Sales Director,
            4. ATRM, 5. Salesperson, 6. Warehouse Worker, 7. Forklift Operator,
            8. Customer Service Rep`,
            choices: [1,2,3,4,5,6,7,8]
        },
        {
            type: 'list',
            name: 'managerId',
            message: `Who is the employee's manager?
                    1. Micheal Scott, 2. Darryl Philbin`,
            choices: [1,2]
        }
    ])
    .then(response => {
        db.query(
            "INSERT INTO employee SET ?",
            [{
                first_name: response.firstName,
                last_name: response.last_name,
                role_id: response.roleId,
                manager_id: response.managerId
            }]
        )
        console.log(`
        ============================
        Employee added successfully!
        ============================
        `);
        mainMenu()
    });
};

function viewDepartments() {
    db.query(`
    SELECT department.id AS ID,
    department.name AS Name
    FROM department;
    `, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.table(res);
        mainMenu();
    })
};

function addDepartment() {
    return inquirer
    .prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'What is the name of the department?',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('Please enter a valid response.');
                    return false;
                }
            }
        }
    ])
    .then(response => {
        db.query(
            "INSERT INTO department SET ?",
            {
                name: response.deptName
            }
        )
        console.log(`
        ==============================
        Department added successfully!
        ==============================
        `);
        mainMenu()
    })
}

function viewManagers() {
    db.query(`
    SELECT manager.id AS ID,
    manager.first_name AS First,
    manager.last_name AS Last,
    department.name AS Dept
    FROM manager
    LEFT JOIN department
    ON manager.department_id = department.id;
    `, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.table(res);
        mainMenu();
    });
}

function addManager() {
    return inquirer
    .prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "What is the manager's first name?",
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
            message: "What is the manager's last name?",
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
            name: 'department',
            message: `What is the manager's department?
                     1. Accounting, 2. Sales, 3. Warehouse, 4. Customer Service`,
            choices: [1, 2, 3, 4]
        }
    ])
      .then(response => {
        db.query(
            "INSERT INTO manager SET ?",
            [{
                first_name: response.firstName,
                last_name: response.last_name,
                department_id: response.department_id
            }]
        )
        console.log(`
        ============================
        Manager added successfully!
        ============================
        `);
        mainMenu()
      })
}

function viewRoles() {
    db.query(`
    SELECT role.title AS Title,
    role.salary AS Salary,
    department.name AS Department
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id;
    `, function(err, res) {
        if (err) {
            console.log(err);
        }
        console.table(res);
        mainMenu();
    })
}

function addRole() {
    db.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the role's title?",
            validate: titleInput => {
                if (titleInput){
                    return true;
                } else {
                    console.log('Please enter a valid response.');
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: "What is the role's salary?",
            validate: salaryInput => {
                if (isNaN(salaryInput) === false){
                    return true;
                } else {
                    console.log('Please enter a valid response.');
                    return false;
                }
            }
        },
        {
            type: 'rawlist',
            name: 'department',
            message: `What is the role's department id?`,
            choices: function() {
                var choicesArr = [];
                for (var i = 0; i < res.length; i++) {
                    choicesArr.push(res[i].id)
                }
                return choicesArr;
            }
        }
    ])
      .then(response => {
        db.query(
            "INSERT INTO role SET ?",
            [{
                title: response.title,
                salary: response.salary,
                department_id: response.department
            }]
        )
        console.log(`
        ========================
        Role added successfully!
        ========================
        `);
        mainMenu();
      });
    });
}

function updateRole() {
    db.query(`SELECT * FROM employee`, (err,res) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: function() {
                        let choicesArr = [];
                        for (var i = 0; i < res.length; i++) {
                            choicesArr.push(res[i].first_name);
                        }
                        return choicesArr;
                    }
                }
            ])
            .then(response => {
                const employeeName = response.employee;

                db.query(`SELECT * FROM role`, (err, res) => {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'role',
                                message: `What is the ID of the employee's new role?`,
                                choices: function() {
                                    let choicesArr = [];
                                    for (var i = 0; i < res.length; i++) {
                                        choicesArr.push(res[i].id);
                                    }
                                    return choicesArr;
                                }
                            }
                        ])
                })
                .then(response => {
                    const roleChoice = response.role;

                    db.query(`UPDATE employee SET ? WHERE first_name = ?`, 
                        [
                            {
                                role_id: roleChoice
                            }, employeeName
                        ]
                )
                console.log(`
        ==========================
        Role updated successfully!
        ==========================
        `);
        mainMenu();
            })
    })
    })
}

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
            process.exit();
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

