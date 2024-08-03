const mysql = require("mysql2/promise");

const getStudents = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1111",
      database: "attendance",
    });
    const [results, fields] = await connection.query("SELECT * FROM STUDENTS");
    console.log(results);
    await connection.end();
  } catch (err) {
    console.log(err);
  }
};

getStudents();

// connection.connect();
// const students = connection.query("select * from students");
// console.log(students);
