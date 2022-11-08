// Defining class to organize any new departments that are created
class Department {
    constructor(name)
};

// Defining class to organize any new roles that are created
class Role {
    constructor(title, salary, department)
};

// Defining class to organize any new employees that are created
class Employee {
    constructor(first_name, last_name, role, manager)
};

module.exports = Department, Role, Employee;