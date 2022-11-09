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

// Defining global variables to later store and update arrays of information from the database
var departments;
var roles;
var employees;
var managers;

const initialQuestion = {
        name: 'choice',
        type: 'list',
        message: 'What would you like to do? ',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', `Update an employee's role`, 'Quit application']
};

const addDepartmentQuestion = {
        name: 'name',
        type: 'input',
        message: 'What is the name of the department you would like to add? '
};


const addRoleQuestions = (departments) => [
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
        choices: departments
    }
];

const addEmployeeQuestions = (roles, managers) => [
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
        name: 'role',
        type: 'list',
        message: 'What is the role of the employee you would like to add? ', 
        choices: roles
    },
    {
        name: 'manager',
        type: 'list',
        message: `What is the manager's name of the employee you would like to add? `,
        choices: managers
    }
];

const updateEmployeeRoleQuestions = (employees, roles) => [
    {
        name: 'employee',
        type: 'list',
        message: `Which employee's role would you like to update? `,
        choices: employees
    },
    {
        name: 'role',
        type: 'list',
        message: `Which role would you like to assign to the selected employee? `,
        choices: roles
    }
];

// Populates the 'departments' array from the database, to be used as choices for inquirer
function getDepartments() {
    db.query({ sql: `SELECT departments.name AS department FROM departments`, rowsAsArray: true}, (err, results) => {
        if (err) {
            console.log(err);
          }
        departments = [].concat(...results);
        // This may not be necessary - if adding roles works, remove this
        return departments;
    });
};

// Populates the 'roles' array from the database, to be used as choices for inquirer
function getRoles() {
    db.query({ sql: 'SELECT roles.title AS role FROM roles', rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
        }
        roles = [].concat(...results);
    })
};

// Populates the 'employees' array from the database, to be used as choices for inquirer
function getEmployees() {
    db.query({ sql: 'SELECT CONCAT(employees.first_name, " ", employees.last_name) AS employees FROM employees', rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
        }
        employees = [].concat(...results);
    })
};

// Populates the 'managers' array from the database, to be used as choices for inquirer
function getManagers() {
    db.query({ sql: `SELECT CONCAT(employees.first_name, " ", employees.last_name) AS manager FROM employees WHERE manager_id IS NULL`, rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
          }
        managers = [].concat(...results);
    });
};

// Lists out all employees in the console using console.table
async function listDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log('');
        console.table(results);
        loadQuestions();
    })
};

// Lists out all roles and their parameters in the console using console.table
function listRoles() {
    db.query('SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log('');
        console.table(results);
        loadQuestions();
    })
};

// Lists out all employees and their parameters in the console using console.table
function listEmployees() {
    db.query(`SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
    FROM employees e
    JOIN roles ON roles.id = role_id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees m ON e.manager_id = m.id
    ORDER BY e.id;`, (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log('');
        console.table(results);
        loadQuestions();
    })
};

function Main() {
    getDepartments();
    getRoles();
    getEmployees();
    getManagers();
    loadQuestions();
};

function loadQuestions() {
    inquirer
        .prompt(initialQuestion)
        .then(responseHandler);
};

function responseHandler(response) {
    if (response.choice === 'View all departments') {
        listDepartments();
    }
    if (response.choice === 'View all roles') {
        listRoles();
    }
    if (response.choice === 'View all employees') {
        listEmployees();
    }
    if (response.choice === 'Add a department') {
        addDepartment();
    }
    if (response.choice === 'Add a role') {
        addRole();
    }
    if (response.choice === 'Add an employee') {
        addEmployee();
    }
    if (response.choice === `Update an employee's role`) {
        updateEmployee();
    }
    if (response.choice === `Quit application`) {
        return;
    }
};

function addDepartment() {
    inquirer
        .prompt(addDepartmentQuestion)
        .then(createDepartment);
};


function createDepartment(response) {
    db.query(`INSERT INTO departments (name) VALUES ('${response.name}')`, (err, response) => {
        if (err) {
            console.log(err);
        }
        getDepartments();
        loadQuestions();
    });
};

var department_id;
// var title;
// var salary;

// async function addRole() {
//     const responses = await inquirer.prompt(addRoleQuestions(departments));
//     const responses2 = await createRole(responses);
//     test(responses2, department_id);
// };

function addRole() {
    inquirer
        .prompt(addRoleQuestions(departments))
        .then(createRoleHandler)
};

function createRoleHandler(response) {
    // Adding a check to see which department id corresponds to the selected department
    const title = response.title;
    const salary = response.salary;
    db.query(`SELECT departments.id FROM departments WHERE departments.name = '${response.department}'`, (err, response) => {
        if (err) {
            console.log(err);
        }
        department_id = response[0].id;
        const newRoleArr = [title, salary, department_id];
        createRole(newRoleArr);
    })

    
};

function createRole(arr) {
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${arr[0]}', ${arr[1]}, ${arr[2]})`, (err, response) => {
        if (err) {
            console.log(err);
        }
        getRoles();
        loadQuestions();
    });
}

Main();








