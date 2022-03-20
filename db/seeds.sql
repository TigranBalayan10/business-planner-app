INSERT INTO departments
  (name)
VALUES
  ('IT'),
  ('Management'),
  ('Research'),
  ('Customer service'),
  ('Accounting');


INSERT INTO roles
  (title, salary, department_id)
VALUES
  ('IT Employee', '100000', 1),
  ('Manager', '167000', 2),
  ('Development employee', '85000', 3),
  ('Customer Service employee', '65000', 4),
  ('Accounting employee', '78000', 5);

INSERT INTO employees
  (first_name, last_name, role_id)
VALUES
  ('Ronald', 'Regan', 2),
  ('Elon', 'Musk', 2);

INSERT INTO employees
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Tigran', 'Balayan', 1, 1),
  ('Alessandro', 'Del Piero', 4, 2),
  ('Nicola', 'Tesla', 3, 2),
  ('Frank', 'Cowperwood', 5, 1),
  ('Winston', 'Smith', 3, 2),
  ('Luca', 'Brasi', 4, 1),
  ('Virgil', 'Sollozzo', 5, 1),
  ('Emmanuel', 'Goldstein', 3, 2),
  ('Thomas', 'Anderson', 1, 2);




  