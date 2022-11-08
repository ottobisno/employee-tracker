const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Banana47$',
        database: 'company_db'
    },
    console.log('Connected to the company_db database.')
);

const initialQuestion = {
        name: 'choice',
        type: 'list',
        message: 'What would you like to do? ',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', `Update an employee's role`]
};

const newDepartmentQuestion = {
        name: 'name',
        type: 'input',
        message: 'What is the name of the department you would like to add? '
};

const newRoleQuestions = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the name of the role you would like to add? '
    },
    {
        name: 'salary',
        type: 'number',
        message: 'What is the salary of the role you would like to add? '
    },
    {
        name: 'department',
        type: 'list',
        message: 'What is the department of the role you would like to add? ',
        // Update this so it reflects what's in the db, once you make sure the app itself is working first
        choices: ['Sales', 'Engineering', 'Finance', 'Legal']
    }
];

const newEmployeeQuestions = [
    {
        name: 'first_name',
        type: 'input',
        message: 'What is the first name of the employee you would like to add? ' 
    },
    {
        name: 'last_name',
        type: 'input',
        message: 'What is the last name of the employee you would like to add? ' 
    },
    {
        // Update this so it reflects what's in the db, once you make sure the app itself is working first
        name: 'role',
        type: 'input',
        message: 'What is the role of the employee you would like to add? ' 
    },
    {
        // Update this so it reflects what's in the db, once you make sure the app itself is working first
        name: 'manager',
        type: 'input',
        message: `What is the manager's name of the employee you would like to add? ` 
    }
];

const updateEmployeeRoleQuestions = [
    {
        name: 'employee',
        type: 'list',
        message: `Which employee's role would you like to update? `,
        // Update this so it reflects what's in the db, once you make sure the app itself is working first
        choices: []
    },
    {
        name: 'role',
        type: 'list',
        message: `Which role would you like to assign to the selected employee? `,
        // Update this so it reflects what's in the db, once you make sure the app itself is working first
        choices: []
    }
];

function Init() {
    inquirer
        .prompt(updateEmployeeRoleQuestions)
};


function getDepartments() {
    db.query({ sql: `SELECT departments.name AS department FROM departments`, rowsAsArray: true}, (err, results) => {
        if (err) {
            console.log(err);
          }
        let departments = [].concat(...results);
        console.log(departments);
    });
};
getDepartments();

function getManagers() {
    db.query({ sql: `SELECT CONCAT(employees.first_name, " ", employees.last_name) AS manager FROM employees WHERE manager_id IS NULL`, rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
          }
        let managers = [].concat(...results);
        console.log(managers);
    });
};
getManagers();

function getRoles() {
    db.query({ sql: 'SELECT roles.title AS role FROM roles', rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
        }
        let roles = [].concat(...results);
        console.log(roles);
    })
};
getRoles();




// Init();