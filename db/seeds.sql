INSERT INTO department (name)
VALUES
    ('Accounting'),
    ('Sales'),
    ('Warehouse'),
    ('Customer Service');

INSERT INTO role (id, title, salary, department_id)
VALUES
    (1, 'Lead Accountant', 120000.00, 1),
    (2, 'Accountant', 75000.00, 1),
    (3, 'Assistant Sales Director', 55000.00, 2),
    (4, 'Assistant To Regional Mgr', 53000.00, 2),
    (5, 'Salesperson', 56000.00, 2),
    (6, 'Warehouse Worker', 50000.00, 3),
    (7, 'Forklift Driver', 100000.00, 3),
    (8, 'Customer Service Rep', 45000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Kevin', 'Malone', 2, 1),
    ('Angela', 'Martin', 2, 1),
    ('Oscar', 'Martinez', 1, 1),
    ('Andrew', 'Bernard', 3, 1),
    ('Dwight', 'Schrute', 4, 1),
    ('Jim', 'Halpert', 5, 1),
    ('Stanley', 'Hudson', 5, 1),
    ('Kelly', 'Kapoor', 8, 1),
    ('Roy', 'Anderson', 6, 2),
    ('Nate', 'Nickerson', 7, 2);

INSERT INTO manager (first_name, last_name, department_id)
VALUES
    ('Michael', 'Scott', NULL),
    ('Darryl', 'Philbin', 3);
