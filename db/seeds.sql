INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES  ("Sales Lead", 100000, 1),
        ("Salesperson", 80000, 1),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 3),
        ("Accountant", 125000, 3),
        ("Legal Team Lead", 250000, 4),
        ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Mark", "Jacobs", 1),
        ("Bill", "Benson", 2, 1),
        ("Jake", "Roberts", 3),
        ("Phillip", "Colby", 4, 3),
        ("Teran", "Marks", 5),
        ("Jeremy", "Cambridge", 6, 5),
        ("Teresa", "Hearth", 7),
        ("Jane", "Janely", 8, 7),
        ("Elizabeth", "Rutherford", 4, 3),
        ("Helen", "Curtis", 2, 1),
        ("Jamie", "Valentina", 6, 5);