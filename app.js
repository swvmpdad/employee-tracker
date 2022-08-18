const inquirer = require('inquirer');

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

        }
        else if (response.menu === 'Add Employee') {

        }
        else if (response.menu === 'View Departments') {
            
        }
        else if (response.menu === 'Add Department') {
            
        }
        else if (response.menu === 'View Managers') {
            
        }
        else if (response.menu === 'View All Roles') {
            
        }
        else if (response.menu === 'Add Role') {
            
        }
        else if (response.menu === 'Update Employee Role') {
            
        }
        else if (response.menu === 'Add Manager') {
            
        }
        else if (response.menu === 'Quit') {

        }
    });
}

mainMenu();