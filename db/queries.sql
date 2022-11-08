-- Queries here are references for the functions in ../lib/helpers.js

-- departments
SELECT * 
FROM departments;

-- roles
SELECT roles.id, roles.title, departments.name AS department, roles.salary
FROM roles
JOIN departments ON roles.department_id = departments.id;

-- employees
SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employees e
JOIN roles ON roles.id = role_id
JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.id;

-- listing managers
SELECT CONCAT(employees.first_name, " ", employees.last_name) AS manager
FROM employees
WHERE manager_id IS NULL;

-- listing departments
SELECT departments.name AS department
FROM departments;

-- listing roles
SELECT roles.title AS role
FROM roles;