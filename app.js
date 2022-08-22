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
            function getRoleId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === response.roleId) {
                        roleId = res[i].id;
                        return roleId;
                    }
                }
            }
            function getManagerId() {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].title === response.managerId) {
                        managerId = res[i].id;
                        return managerId;
                    }
                }
            }
            getRoleId();
            getManagerId();
            db.query("SELECT * FROM employee", (err, res) => {
                if (err) throw err;
                let employeeId = res.length + 1;
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
                        mainMenu()
                    })
            });
        })
    })    
}

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
                mainMenu()
            }
        )
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
                    for (var i = 0; i < res.length; i++) {
                        choicesArr.push(res[i].name);
                    }
                    return choicesArr;
                }
            }
        ])
        .then(response => {
            db.query(`SELECT * FROM department WHERE name = "${response.department}"`, (err, res) => {
                if (err) throw err;
                let departmentChoice = res[0].id;
                db.query(
                    "INSERT INTO manager SET ?",
                    [{
                        first_name: response.firstName,
                        last_name: response.lastName,
                        department_id: departmentChoice
                    }], err => {
                        if (err) throw err;
                        console.log(`
                        ============================
                        Manager added successfully!
                        ============================
                        `);
                        mainMenu()
                    }
                )
            })
        })
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
        function getDeptId() {
            for (var i = 0; i < res.length; i++) {
                if (res[i].name === response.department) {
                    departmentId = res[i].id;
                    return departmentId;
                }
            }
        }
        getDeptId();
        db.query(`SELECT * FROM role`, (err,res) => {
            if (err) throw err;
            let id = res.length + 1;
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
                    mainMenu();
                }
            )
        })
        })    
    })
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
                        .then(response => {
                            const roleChoice = response.role;
        
                            db.query(`UPDATE employee SET ? WHERE first_name = ?`, 
                                [
                                    {
                                        role_id: roleChoice
                                    }, employeeName
                                ], err => {
                                    if (err) throw err;
                                    console.log(`
                                    ==========================
                                    Role updated successfully!
                                    ==========================
                                    `);
                                    mainMenu();
                                }
                        )
                })  
            })
    })
    })
}

function mainMenu() {
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

mainMenu();