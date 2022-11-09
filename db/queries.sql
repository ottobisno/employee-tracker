-- Queries here are references for the functions in ../lib/helpers.js

-- departments table
-- SELECT * 
-- FROM departments;

-- -- roles table
-- SELECT roles.id, roles.title, departments.name AS department, roles.salary
-- FROM roles
-- JOIN departments ON roles.department_id = departments.id;

-- -- employees table
-- SELECT e.id, e.first_name, e.last_name, roles.title AS title, departments.name AS department, roles.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
-- FROM employees e
-- JOIN roles ON roles.id = role_id
-- JOIN departments ON roles.department_id = departments.id
-- LEFT JOIN employees m ON e.manager_id = m.id
-- ORDER BY e.id;

-- -- listing departments
-- SELECT departments.name AS department
-- FROM departments;

-- -- listing roles
-- SELECT roles.title AS role
-- FROM roles;

-- -- listing employees
-- SELECT CONCAT(employees.first_name, " ", employees.last_name) AS employees
-- FROM employees;

-- -- listing managers
-- SELECT CONCAT(employees.first_name, " ", employees.last_name) AS manager
-- FROM employees
-- WHERE manager_id IS NULL;

-- selecting the department_id based on the department name
SELECT departments.id 
FROM departments WHERE departments.name = "Sales";

-- selecting the role_id based on the role name
SELECT roles.id 
FROM roles WHERE roles.title = "Lead Engineer";

-- selecting the role_id based on the role name
SELECT employees.manager_id
FROM employees WHERE CONCAT(employees.first_name, " ", employees.last_name) = "Bill Benson";