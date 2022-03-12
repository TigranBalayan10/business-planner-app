const inquirer = require("inquirer");
const cTable = require("console.table");
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
          showDeps();
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
      const sql = `INSERT INTO roles(title, salary)
      VALUES ("${answer.title}", "${answer.salary}");`;
      db.then((conn) => {
        conn.query(sql).then((rows) => {
          showRoles();
        });
      }).then(() => {
        const sql = `INSERT INTO departments(name)
        VALUES ("${answer.dept}");`;
        db.then((conn) => {
          conn.query(sql).then((rows) => {
            showDeps();
          });
        });
      });
    });
}

function addEmployee() {
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
        name: "title",
        message: "Enter Role",
        type: "input",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO employees (first_name, last_name)
        VALUES ('${answer.first_name}', '${answer.last_name}');`;
      db.then((conn) => {
        conn.query(sql);
      }).then(() => {
        const sql = `INSERT INTO roles (title)
          VALUES ("${answer.title}");`;
        db.then((conn) => {
          conn.query(sql).then(console.log("Employees Added to Database"));
        });
      });
    });
}
