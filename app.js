// allows us to use inquirer and connect to the sql database
const inquirer = require('inquirer');
const db = require('./db/connection');

function viewEmployees() {
    // joining the tables to show specific information
    // about each employee
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
        if (err) throw err;
        // displaying the called info to a table
        console.table(res);
        // calling main menu function
        mainMenu();
    });
}

function viewEmployeesByManager() {
    db.query(`SELECT * FROM manager`, (err, res) => {
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: `Which manager's employees would you like to view?`,
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
            let managerId;
            function getManagerId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].first_name === response.manager) {
                        managerId = res[i].id;
                        return managerId;
                    }
                }
            }
            getManagerId();
            db.query(`SELECT employee.id AS ID,
            employee.first_name AS First,
            employee.last_name AS Last,
            role.title AS Role,
            role.salary AS Salary
            FROM employee
            LEFT JOIN role
            ON employee.role_id = role.id
            WHERE employee.manager_id = ${managerId}`,
            function(err, res) {
                if (err) throw err;
                // displaying the called info to a table
                console.table(res);
                // calling main menu function
                mainMenu();
            })
          })
    })
}

function viewEmployeesByDepartment() {
    db.query(`SELECT * FROM department`, (err, res) => {
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department's employees would you like to view?`,
                choices: function() {
                    let choicesArr = [];
                    for (var i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].name);
                    }
                    return choicesArr;
                }
            }
        ])
          .then(response => {
            let departmentId;
            function getDeptId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].name === response.department) {
                        departmentId = res[i].id;
                        return departmentId;
                    }
                }
            }
            getDeptId();
            db.query(`SELECT employee.id AS ID,
            employee.first_name AS First,
            employee.last_name AS Last,
            role.title AS Role,
            role.salary AS Salary,
            manager.first_name AS Manager
            FROM employee
            LEFT JOIN manager
            ON employee.manager_id = manager.id
            LEFT JOIN role
            ON employee.role_id = role.id
            WHERE role.department_id = ${departmentId}`,
            function(err, res) {
                if (err) throw err;
                // displaying the called info to a table
                console.table(res);
                // calling main menu function
                mainMenu();
            })
          })
    })
}

function addEmployee() {
    db.query("SELECT * FROM role UNION SELECT * FROM manager", (err,res) => {
        if (err) throw err;
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
                type: 'rawlist',
                name: 'roleId',
                message: `What is the employee's role?`,
                choices: function() {
                    let choicesArr = [];
                    for (var i = 0; i < res.length; i++) {
                        // The results of the db.query UNION combine the two tables
                        // so I pulled the choices based off of the salary 
                        // being a number and not a last name from the manager table
                        if (isNaN(res[i].salary) === false) {
                        choicesArr.push(res[i].title);
                        }
                    }
                    return choicesArr;
                }
            },
            {
                type: 'rawlist',
                name: 'managerId',
                message: `Who is the employee's manager?`,
                choices: function() {
                    let choicesArr2 = [];
                    for (var i = 0; i < res.length; i++) {
                        // I did the opposite here and if it returned a
                        // number it would skip until it found a last 
                        // name in the salary column
                        if (isNaN(res[i].salary) === true)
                        choicesArr2.push(res[i].title);
                    }
                    return choicesArr2;
                }
            }
        ])
        .then(response => {
            let firstName = response.firstName;
            let lastName =  response.lastName;
            let roleId;
            let managerId;
            // function to pull the role.id by matching it to the response.title
            function getRoleId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === response.roleId) {
                        roleId = res[i].id;
                        return roleId;
                    }
                }
            }
            // function to pull the manager.id by matching it to the response.title
            function getManagerId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === response.managerId) {
                        managerId = res[i].id;
                        return managerId;
                    }
                }
            }
            // calling both functions
            getRoleId();
            getManagerId();
            // querying the db to get the next increment of employee id
            db.query("SELECT * FROM employee", (err, res) => {
                if (err) throw err;
                let employeeId = res.length + 1;
                // inserting the new values into the employee table
                db.query(
                    "INSERT INTO employee SET ?",
                    [{
                        id: employeeId,
                        first_name: firstName,
                        last_name: lastName,
                        role_id: roleId,
                        manager_id: managerId
                    }], err => {
                        if (err) throw err;
                        console.log(`
                        ============================
                        Employee added successfully!
                        ============================
                        `);
                        // calling the main menu after the function has run
                        mainMenu()
                    })
            });
        })
    })    
}

function viewDepartments() {
    // query to show departments
    db.query(`
    SELECT department.id AS ID,
    department.name AS Name
    FROM department;
    `, function(err, res) {
        if (err) throw err;
        // displaying departments in a table
        console.table(res);
        // calling the main menu
        mainMenu();
    })
}

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
        // inserting the new department into the department table
        db.query(
            "INSERT INTO department SET ?",
            [{
                name: response.deptName
            }], err => {
                if (err) throw err;
                console.log(`
                ==============================
                Department added successfully!
                ==============================
                `);
                // calling main menu
                mainMenu()
            }
        )
    })
}

function viewManagers() {
    // queries all managers
    db.query(`
    SELECT manager.id AS ID,
    manager.first_name AS First,
    manager.last_name AS Last,
    department.name AS Dept
    FROM manager
    LEFT JOIN department
    ON manager.department_id = department.id;
    `, function(err, res) {
        if (err) throw err;
        // displays all managers in a console table
        console.table(res);
        // calls main menu
        mainMenu();
    });
}

function addManager() {
    // queries the department table to generate department choices
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
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
                message: `What is the manager's department?`,
                choices: function () {
                    let choicesArr = [];
                    // returns an array of department choices
                    for (var i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].name);
                    }
                    return choicesArr;
                }
            }
        ])
        .then(response => {
            // gets the department id from the initial query
            let departmentId;
            function getDeptId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].name === response.department) {
                        departmentId = res[i].id;
                        return departmentId;
                    }
                }
            }
            getDeptId();
            // inserts data into the table
            db.query(
                "INSERT INTO manager SET ?",
                [{
                    first_name: response.firstName,
                    last_name: response.lastName,
                    department_id: departmentId
                }], err => {
                    if (err) throw err;
                    console.log(`
                    ============================
                    Manager added successfully!
                    ============================
                    `);
                    // calls the main menu
                    mainMenu()
                }
            )
        })
    })
}

function viewRoles() {
    // queries the role and department tables and joins them
    db.query(`
    SELECT role.title AS Title,
    role.salary AS Salary,
    department.name AS Department
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id;
    `, function(err, res) {
        if (err) throw err;
        // displays the table
        console.table(res);
        // calls the main menu
        mainMenu();
    })
}

function addRole() {
    // calls the department to generate dynamic choice list
    db.query("SELECT * FROM department", function(err, res) {
    if (err) throw err;
     return inquirer
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
                // validates whether the input is a number or not
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
            message: `What is the role's department?`,
            choices: function() {
                var choicesArr = [];
                // generates a dynamic choice array
                for (var i = 0; i < res.length; i++) {
                    choicesArr.push(res[i].name)
                }
                return choicesArr;
            }
        }
    ])
      .then(response => {
        let title = response.title;
        let salary = response.salary;
        let departmentId;
        // gets the department id from the original query
        function getDeptId() {
            for (var i = 0; i < res.length; i++) {
                if (res[i].name === response.department) {
                    departmentId = res[i].id;
                    return departmentId;
                }
            }
        }
        getDeptId();
        // gets the next increment of the role id
        db.query(`SELECT * FROM role`, (err,res) => {
            if (err) throw err;
            let id = res.length + 1;
            // inserts data into table
            db.query(
                "INSERT INTO role SET ?",
                [{
                    id: id,
                    title: title,
                    salary: salary,
                    department_id: departmentId
                }], err => {
                    if (err) throw err;
                    console.log(`
                    ========================
                    Role added successfully!
                    ========================
                    `);
                    // calls the main menu
                    mainMenu();
                }
            )
        })
        })    
    })
}

function updateRole() {
    // calls a list of employees to generate choices
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
                        // generates a list of employee choices
                        for (var i = 0; i < res.length; i++) {
                            choicesArr.push(res[i].first_name);
                        }
                        return choicesArr;
                    }
                }
            ])
            .then(response => {
                // defines the chosen employee's first name for use later
                const employeeName = response.employee;
                // calls the roles to generate a list of choices
                db.query(`SELECT * FROM role`, (err, res) => {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: 'rawlist',
                                name: 'role',
                                message: `What is the employee's new role?`,
                                choices: function() {
                                    let choicesArr = [];
                                    // generates list of roles
                                    for (var i = 0; i < res.length; i++) {
                                        choicesArr.push(res[i].title);
                                    }
                                    return choicesArr;
                                }
                            }
                        ])
                        .then(response => {
                            // defines the chosen role
                            let role;
                            function getRoleId() {
                                for (var i = 0; i < res.length; i++) {
                                    if (res[i].title === response.role) {
                                        role = res[i].id
                                        return role;
                                    }
                                }
                            }
                            getRoleId();
                            // inserts and overrides the current data in the table based off of the employeeName
                            db.query(`UPDATE employee SET ? WHERE first_name = ?`, 
                                [
                                    {
                                        role_id: role
                                    }, employeeName
                                ], err => {
                                    if (err) throw err;
                                    console.log(`
                                    ==========================
                                    Role updated successfully!
                                    ==========================
                                    `);
                                    // calls main menu
                                    mainMenu();
                                }
                        )
                })  
            })
    })
    })
}

function removeEmployee() {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which Employee would you like to remove?',
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
            db.query(`DELETE FROM employee WHERE first_name = '${response.employee}'`,
            (err, res) => {
                if (err) throw err;
                console.log(`
                ==============================
                Employee Removed Successfully!
                ==============================
                `);
                mainMenu();
            })
          })
    })
}

function removeDepartment() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department would you like to remove?',
                choices: function() {
                    let choicesArr = [];
                    for (var i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].name);
                    }
                    return choicesArr;
                }
            }
        ])
          .then(response => {
            db.query(`DELETE FROM department WHERE name = '${response.department}'`,
            (err, res) => {
                if (err) throw err;
                console.log(`
                ================================
                Department Removed Successfully!
                ================================
                `);
                mainMenu();
            })
          })
    })
}

function removeManager() {
    db.query(`SELECT * FROM manager`, (err, res) => {
        if (err) throw err;
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to remove?',
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
            db.query(`DELETE FROM manager WHERE first_name = '${response.manager}'`,
            (err, res) => {
                if (err) throw err;
                console.log(`
                =============================
                Manager Removed Successfully!
                =============================
                `);
                mainMenu();
            })
          })
    })
}

function removeRole() {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        return inquirer
        .prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role would you like to remove?',
                choices: function() {
                    let choicesArr = [];
                    for (var i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].title);
                    }
                    return choicesArr;
                }
            }
        ])
          .then(response => {
            db.query(`DELETE FROM role WHERE title = '${response.role}'`,
            (err, res) => {
                if (err) throw err;
                console.log(`
                ==========================
                Role Removed Successfully!
                ==========================
                `);
                mainMenu();
            })
          })
    })
}

// The main menu that you'll see in the app
function mainMenu() {
    // connection to the sql database
    db.connect(function(err) {
        if (err) {
            console.log(err);
        }
        console.log('Connected to database!');
    });
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
            'View Employees By Manager',
            'View Employees By Department',
            'Add Employee',
            'View Departments',
            'Add Department',
            'View Managers',
            'Add Manager',
            'View All Roles',
            'Add Role',
            'Update Employee Role',
            'Remove Employee',
            'Remove Department',
            'Remove Manager',
            'Remove Role',
            'Quit'
        ]
        }
    ])
    // calling the function based on the response of the user
    .then(response => {
        if (response.menu === 'View All Employees') {
            viewEmployees();
        }
        else if (response.menu === 'View Employees By Manager') {
            viewEmployeesByManager();
        }else if (response.menu === 'View Employees By Department') {
            viewEmployeesByDepartment();
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
        else if (response.menu === 'Add Manager') {
            addManager();
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
        else if (response.menu === 'Remove Employee') {
            removeEmployee();
        }
        else if (response.menu === 'Remove Department') {
            removeDepartment();
        }
        else if (response.menu === 'Remove Manager') {
            removeManager();
        }
        else if (response.menu === 'Remove Role') {
            removeRole();
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

// starting the menu
mainMenu();