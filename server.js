// Importing node packages
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Creating a connection to the database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Banana47$',
        database: 'company_db'
    },
    console.log('Connected to the company_db database.')
);

// Choices the user will be prompted with initially and after each action
const initialQuestion = {
        name: 'choice',
        type: 'list',
        message: 'What would you like to do? ',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', `Update an employee's role`, 'Quit application']
};

// Question the user will be prompted with when adding a new department
const addDepartmentQuestion = {
        name: 'name',
        type: 'input',
        message: 'What is the name of the department you would like to add? '
};

// Questions the user will be prompted with when adding a new role
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

// Questions the user will be prompted with when adding a new employee
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

// Questions the user will be prompted with when updating an employee's role
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
    });
};

// Populates the 'roles' array from the database, to be used as choices for inquirer
function getRoles() {
    db.query({ sql: 'SELECT roles.title AS role FROM roles', rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
        }
        roles = [].concat(...results);
    });
};

// Populates the 'employees' array from the database, to be used as choices for inquirer
function getEmployees() {
    db.query({ sql: 'SELECT CONCAT(employees.first_name, " ", employees.last_name) AS employees FROM employees', rowsAsArray: true }, (err, results) => {
        if (err) {
            console.log(err);
        }
        employees = [].concat(...results);
    });
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
    });
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
    });
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
    });
};

// Initial choices to be loaded by inquirer upon initializing the app
function loadQuestions() {
    inquirer
        .prompt(initialQuestion)
        .then(responseHandler);
};

// Handles the various responses the user can provide 
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
        updateEmployeeRole();
    }
    if (response.choice === `Quit application`) {
        process.exit();
    }
};

// When 'Add a department' is chosen, prompts the user for information and uses that information to create a new department
function addDepartment() {
    inquirer
        .prompt(addDepartmentQuestion)
        .then(createDepartment);
};

// Creates a new department in the database based on user input
function createDepartment(response) {
    db.query(`INSERT INTO departments (name) VALUES ('${response.name}')`, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(`Department successfully created.`);
        console.log('');
        getDepartments();
        loadQuestions();
    });
};

// When 'Add a role' is chosen, prompts the user for information and uses that information to create a new role
function addRole() {
    inquirer
        .prompt(addRoleQuestions(departments))
        .then(createRoleHandler);
};

// Takes the department name specified by the user and returns the id for that department, in addition to the rest of the response
function createRoleHandler(response) {
    const { title, salary, department} = response;
    db.query(`SELECT departments.id FROM departments WHERE departments.name = '${department}'`, (err, response) => {
        if (err) {
            console.log(err);
        }
        const department_id = response[0].id;
        createRole(title, salary, department_id);
    });
};

// Creates a new role in the database based on user input
function createRole(title, salary, department_id) {
    db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id})`, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(`Role successfully created.`);
        console.log('');
        getRoles();
        loadQuestions();
    });
};

// When 'Add an employee' is chosen, prompts the user for information and uses that information to create a new employee
function addEmployee() {
    inquirer
        .prompt(addEmployeeQuestions(roles, managers))
        .then(createEmployeeHandler);
};

// Takes the role name specified by the user and returns the id for that role, in addition to the rest of the response
function createEmployeeHandler(response) {
    const { first_name, last_name, role, manager } = response;
    db.query(`SELECT roles.id FROM roles WHERE roles.title = '${role}'`, (err, response) => {
        if (err) {
            console.log(err);
        }
        const role_id = response[0].id;
        newEmployeeManagerhandler(first_name, last_name, role_id, manager);
    });
};

// Takes the manager's name specified by the user and returns the id for that manager, in addition to the rest of the response
function newEmployeeManagerhandler(first_name, last_name, role_id, manager) {
    db.query(`SELECT employees.id FROM employees WHERE CONCAT(employees.first_name, " ", employees.last_name) = '${manager}'`, (err, response) => {
        if (err) {
            console.log(err);
        }
        const manager_id = response[0].id;
        createEmployee(first_name, last_name, role_id, manager_id);
    });
};

// Creates a new employee in the database based on user input
function createEmployee(first_name, last_name, role_id, manager_id) {
    db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${manager_id})`, (err, response) => {
        if (err) {
            console.log(err);
        }
        console.log(`Employee successfully added.`);
        console.log('');
        getEmployees();
        loadQuestions();
    });
};

// When 'Update an employee's role' is chosen, prompts the user for information and uses that information to update the employee's role
function updateEmployeeRole() {
    inquirer
        .prompt(updateEmployeeRoleQuestions(employees, roles))
        .then(updateEmployeeRoleHandler1);
};

// Takes the role specified by the user and returns the id for that role, in addition to the rest of the response
function updateEmployeeRoleHandler1(response) {
    const { employee, role } = response;
    db.query(`SELECT roles.id FROM roles WHERE roles.title = '${role}'`, (err, response) => {
        if (err) {
            console.log(err);
        }
        const role_id = response[0].id;
        updateEmployeeRoleHandler2(employee, role_id);
    });
};

// Takes the employee specified by the user and the role_id returned from the previous function and updates the specified employee's role
function updateEmployeeRoleHandler2(employee, role_id) {
    db.query(`UPDATE employees SET employees.role_id = ${role_id} WHERE CONCAT(employees.first_name, " ", employees.last_name) = '${employee}'`, (err, response) => {
        if (err) {
            console.log(err)
        }
        console.log(`Employee's role successfully updated.`);
        console.log('');
        getEmployees();
        loadQuestions();
    });
};

// Initializes the application
function Init() {
    getDepartments();
    getRoles();
    getEmployees();
    getManagers();
    loadQuestions();
};

// Initializes the application
Init();







