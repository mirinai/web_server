const express = require("express"); //express 라이브러리, 외부환경에서(브라우저에서는 import)

const mysql = require("mysql2/promise");

const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const DATABASE = {
  CONFIG: {
    host: "localhost",
    user: "root",
    password: "1111",
    database: "attendance",
  },
  QUERY: {
    STUDENTS: {
      FINDALL: "SELECT * FROM STUDENTS",
      FINDBYID: `SELECT * FROM STUDENTS WHERE ID = ?`,
      FINDBYADDRESS: `SELECT * FROM STUDENTS WHERE ADDRESS LIKE "?"`,
      UPDATEBYID: `UPDATE STUDENTS SET NAME = "?" WHERE ID = ?`,
    },
  },
};

const executeQuery = async (query, params = []) => {
  try {
    const connection = await mysql.createConnection(DATABASE.CONFIG);
    const [results] = await connection.query(query, params);
    await connection.end();
    return results;
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000); //localhost:3000

app.get("/", (req, res) => {
  res.send(
    "Hello World+ /icecream, /rap, /movie, /students, /api/students, /api/students/(:address, ) "
  );
});

app.get("/icecream", (req, res) => {
  res.send("<h1>아이스크림</h1>");
});

app.get("/rap", (req, res) => {
  res.send("랩");
});

app.get("/movie", (req, res) => {
  const movie = [
    { name: "인사이드아웃2", running: 90 },
    { name: "파일럿", running: 100 },
    { name: "사랑의 하츄핑", running: 70 },
  ];
  res.json(movie);
});

// /students => json으로 다 가져오기

// const getStudents = async () => {
//   // try {
//   //   const connection = await mysql.createConnection(DATABASE.CONFIG);
//   //   const [results] = await connection.query(DATABASE.QUERY.STUDENTS.FINDALL);
//   //   await connection.end();
//   //   return results;
//   // } catch (err) {
//   //   console.log(err);
//   // }

//     return await executeQuery(DATABASE.QUERY.STUDENTS.FINDALL)

// };
const getStudents = async () =>
  await executeQuery(DATABASE.QUERY.STUDENTS.FINDALL);
const getIdStudents = async (id) =>
  await executeQuery(DATABASE.QUERY.STUDENTS.FINDBYID, [id]);
const getAddressStudents = async (address) =>
  await connection.execute(DATABASE.QUERY.STUDENTS.FINDBYADDRESS, [
    `${address}%`,
  ]);
const updateStudent = async (id, name) =>
  await connection.execute(DATABASE.QUERY.STUDENTS.UPDATEBYID, [`${id}`]);
app.get("/students", async (req, res) => {
  //   res.json(await getStudents());
  const data = await getStudents();
  console.log(data);

  //서버사이드 렌더링
  res.send(
    ` <section
      style="
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      "
    >
    ${data.map(({ name, phone, address }) => {
      return `<div
        style="
          display: flex;
          flex-direction: column;
          width: 100px;
          padding: 20px;
          align-items: center;
        "
      >
        <div style="width: 50px; height: 50px; object-fit: contain">
          <img
            src="프사.jpg"
            alt=""
            style="width: 100%; height: 100%; border-radius: 99px"
          />
        </div>
      </div>
      <h5>${name}</h5>
      <h6 style="font-size: 16px">0${phone}</h6>
      <h6>${address}</h6>`;
    })}
      
    </section>`
  );
});

app.get("/api/students", async (req, res) => {
  res.json(await getStudents());
});

app.get("/cars/:id", (req, res) => {
  res.send(`Cars ID: ${req.params.id}`);
});

// const getIdStudents = async (id) => {
//   try {
//     const connection = await mysql.createConnection(DATABASE.CONFIG);
//     // const [results] = await connection.query(
//     //   `SELECT * FROM STUDENTS WHERE ID = ${id}`
//     // );
//     const [results] = await connection.execute(
//       DATABASE.QUERY.STUDENTS.FINDBYID,
//       [id]
//     );
//     await connection.end();
//     return results;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const getAddressStudents = async (address) => {
//   try {
//     const connection = await mysql.createConnection(DATABASE.CONFIG);
//     // const [results] = await connection.query(
//     //   `SELECT * FROM STUDENTS WHERE ADDRESS LIKE "${address}%"`
//     // );
//     const [results] = await connection.execute(
//       DATABASE.QUERY.STUDENTS.FINDBYADDRESS,
//       [`${address}%`]
//     );
//     await connection.end();
//     return results;
//   } catch (err) {
//     console.log(err);
//   }
// };
// const getNameStudents = async (name) => {
//   try {
//     const connection = await mysql.createConnection(DATABASE.CONFIG);
//     const [results] = await connection.query(
//       `SELECT * FROM STUDENTS WHERE NAME = "${name}"`
//     );
//     await connection.end();
//     return results;
//   } catch (err) {
//     console.log(err);
//   }
// };

// const updateStudent = async (id, name) => {
//   try {
//     const connection = await mysql.createConnection(DATABASE.CONFIG);
//     // const [results] = await connection.query(
//     //   `UPDATE STUDENTS SET NAME = "${name}" WHERE ID = ${id}`
//     // );
//     const [results] = await connection.execute(
//       DATABASE.QUERY.STUDENTS.UPDATEBYID,
//       [id]
//     );
//     await connection.end();
//     return results;
//   } catch (err) {
//     console.log(err);
//   }
// };
// /api/students/<입력>

// app.get("/api/students/:id", async (req, res) => {
//   const data = await getIdStudents(req.params.id);
//   res.json(data[0]);
// });

// // /api/students/search?=<입력>

// app.get("/api/students/search", async (req, res) => {
//   //const data = await getIdStudents(req.params.id);
//   res.send(`찾는 학생: ${req.query.name}`);
// });

app.get("/api/students/search", async (req, res) => {
  const data = await getAddressStudents(req.query.address);

  res.json(data);
  // res.send(data);
});

//기능 고치기
app.post("/api/students/test", (req, res) => {
  const { name, age, desc } = req.body;
  console.log({ name, age, desc });
  res.json({ result: "success" });
});

//학생이름 수정하는 API 만들기
// post id와 이름을 줬을 때 고치면 됨

app.post("/api/students/rename", async (req, res) => {
  const { id, name } = req.body; //가져옴
  const result = await updateStudent(id, name);

  res.json({ result });
});
