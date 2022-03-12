INSERT INTO departments
  (name)
VALUES
  ('IT'),
  ('HR'),
  ('Research'),
  ('Customer service'),
  ('Accounting');


INSERT INTO roles
  (title, salary, department_id)
VALUES
  ('IT employee', '100000', 1),
  ('HR employee', '92000', 2),
  ('Development employee', '85000', 3),
  ('Customer Service employee', '65000', 4),
  ('Accounting employee', '78000', 5);

INSERT INTO employees
  (first_name, last_name, role_id)
VALUES
  ('Tigran', 'Balayan', 1),
  ('Ronald', 'Regan', 2),
  ('Elon', 'Musk', 3),
  ('Alessandro', 'Del Piero', 4),
  ('Nicola', 'Tesla', 3),
  ('Frank', 'Cowperwood', 5),
  ('Winston', 'Smith', 2),
  ('Luca', 'Brasi', 4),
  ('Virgil', 'Sollozzo', 2),
  ('Emmanuel', 'Goldstein', 3),
  ('Thomas', 'Anderson', 1);



  