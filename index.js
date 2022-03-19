const inquirer = require("inquirer");
const mysql = require("mysql2/promise");

const db = mysql.createConnection({
  host: "localhost",
  // Your MySQL username,
  user: "root",
  // Your MySQL password
  password: "",
  database: "bus_planner",
});

inquirer
  .prompt([
    {
      type: "list",
      name: "body",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ])
  .then((answers) => {
    switch (answers.body) {
      case "View all departments":
        showDeps();
        break;
      case "View all roles":
        showRoles();
        break;
      case "View all employees":
        showEmployees();
        break;
      case "Add a department":
        addDept();
        break;
      case "Add a role":
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        UpdateEmployeeRole();
        break;
      default:
        console.log(`Action (${answers.body}) is not supported.`);
        break;
    }
  });

function showDeps() {
  const sql = `SELECT * FROM departments`;
  db.then((conn) => conn.query(sql)).then(([rows, fields]) =>
    console.table(rows)
  );
}

function showRoles() {
  const sql = `SELECT roles.title, roles.id, departments.name AS department, roles.salary
      FROM roles
      LEFT JOIN departments
      ON roles.department_id = departments.id;`;
  db.then((conn) => conn.query(sql)).then(([rows, fields]) =>
    console.table(rows)
  );
}

function showEmployees() {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary
  FROM employees
  LEFT JOIN roles
  ON employees.role_id = roles.id
  LEFT JOIN departments
  ON roles.department_id = departments.id;`;
  db.then((conn) => conn.query(sql)).then(([rows, fields]) =>
    console.table(rows)
  );
}

function addDept() {
  inquirer
    .prompt([
      {
        name: "add_dept",
        message: "Add",
        type: "input",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO departments(name)
      VALUES ("${answer.add_dept}");`;
      db.then((conn) => {
        conn.query(sql).then((rows) => {
          console.log(`Department has been added!`);
        });
      });
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        message: "Enter Job title",
        type: "input",
      },
      {
        name: "salary",
        message: "Enter Salary",
        type: "input",
      },
      {
        name: "dept",
        message: "Department",
        type: "input",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO roles(title, salary, department_id)
      VALUES ("${answer.title}", ${answer.salary}, ${answer.dept})`;
      db.then((conn) => {
        conn.query(sql).then(() => {
          console.log("Role has been added to database!");
        });
      });
    });
}

function addEmployee() {
  const managerQuery = `SELECT * FROM employees WHERE role_id = 2`;
  const roleQuery = `SELECT * FROM roles`;

  db.then((conn) => {
    return Promise.all([conn.query(managerQuery), conn.query(roleQuery)]).then(
      ([[managerResponse], [roleResponse]]) => {
        inquirer
          .prompt([
            {
              name: "first_name",
              message: "Enter First Name",
              type: "input",
            },
            {
              name: "last_name",
              message: "Enter Last Name",
              type: "input",
            },
            {
              name: "role_id",
              message: "Choose a Role",
              type: "list",
              choices: roleResponse.map((role) => {
                role.name = role.title;
                role.value = role.id;
                return role;
              }),
            },
          ])
          .then((answers) => {
            if (answers.role_id !== 2) {
              return inquirer
                .prompt([
                  {
                    name: "manager_id",
                    message: "Choose Manager Name",
                    type: "list",
                    choices: managerResponse.map((employee) => {
                      employee.name =
                        employee.first_name + " " + employee.last_name;
                      employee.value = employee.id;
                      return employee;
                    }),
                  },
                ])
                .then(({ manager_id }) => {
                  return Promise.resolve({ ...answers, manager_id });
                });
            } else {
              return Promise.resolve(answers);
            }
          })
          .then(({ first_name, last_name, role_id, manager_id }) => {
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('${first_name}', '${last_name}', ${role_id}, ${
              manager_id || "NULL"
            })`;
            conn.query(sql).then(() => {
              console.log("Employee has been added to database!");
            });
          });
      }
    );
  });
}

function UpdateEmployeeRole() {
  const employeesQuery = `SELECT * FROM employees`;
  const roleQuery = `SELECT * FROM roles`;
  db.then((conn) => {
    return Promise.all([
      conn.query(employeesQuery),
      conn.query(roleQuery),
    ]).then(([[employeesResponse], [roleResponse]]) => {
      inquirer
        .prompt([
          {
            name: "full_name",
            message: "Choose an employee",
            type: "list",
            choices: employeesResponse.map((employee) => {
              employee.name = employee.first_name + " " + employee.last_name;
              employee.value = employee.id;
              return employee;
            }),
          },
          {
            name: "role",
            message: "Choose a role",
            type: "list",
            choices: roleResponse.map((role) => {
              role.name = role.title;
              role.value = role.id;
              return role;
            }),
          },
        ])
        .then((answers) => {
          const sql = `UPDATE employees SET role_id = ${answers.role} WHERE employees.id = ${answers.full_name}`;
          conn.query(sql).then(() => {
            console.log("Employee has been updated in database!");
          });
        });
    });
  });
}
