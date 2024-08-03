const express = require("express"); //express 라이브러리, 외부환경에서(브라우저에서는 import)
const app = express();

app.listen(3000); //localhost:3000

app.get("/", (req, res) => {
  res.send("Hello World+ /icecream & /rap으로 치기");
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

const mysql = require("mysql2/promise");

const getStudents = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1111",
      database: "attendance",
    });
    const [results] = await connection.query("SELECT * FROM STUDENTS");
    await connection.end();
    return results;
  } catch (err) {
    console.log(err);
  }
};

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

const getIdStudents = async (id) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1111",
      database: "attendance",
    });
    const [results] = await connection.query(
      `SELECT * FROM STUDENTS WHERE ID = ${id}`
    );
    await connection.end();
    return results;
  } catch (err) {
    console.log(err);
  }
};

const getAddressStudents = async (address) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1111",
      database: "attendance",
    });
    const [results] = await connection.query(
      `SELECT * FROM STUDENTS WHERE ADDRESS LIKE "${address}%"`
    );
    await connection.end();
    return results;
  } catch (err) {
    console.log(err);
  }
};
// /api/students/<입력>

// app.get("/api/students/:id", async (req, res) => {
//   const data = await getIdStudents(req.params.id);
//   res.json(data[0]);
// });

// /api/students/search?=<입력>

// app.get("/api/students/search", async (req, res) => {
//   //   const data = await getIdStudents(req.params.id);
//   res.send(`찾는 학생: ${req.query.name}`);
// });

app.get("/api/students/search", async (req, res) => {
  const data = await getAddressStudents(req.query.address);

  res.json(data);
});
