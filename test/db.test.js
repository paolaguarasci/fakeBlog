const db = require('../db');

describe("Preliminari", () => {
  test("Funzione importata corretamente", () => {
    return db.read('SELECT * FROM users').then((res) => {
      expect(res).not.toBeUndefined();
    });
  });
  test("Return an array", () => {
    return db.read('SELECT * FROM users').then((res) => {
      expect(res.rows instanceof Array).toBe(true);
    });
  });
});

describe("CRUD", () => {
  test("Add row", () => {
    let query = "INSERT INTO users values(8, 'Ciccio Pasticcio', 'mia@email.com', 'password');";

    db.insert(query).then((res) => {
      try {
        expect(res).toBe(true);
      } catch (e) {
        console.log(e);
        return false;
      }
    }).catch(err => console.error(err.message));

  });
  // test("Add rows", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Read row", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Read row", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Update row", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Update rows", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Delete row", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
  // test("Delete row", () => {
  //   return db('SELECT * FROM student').then((res) => {
  //     expect(res).not.toBeUndefined();
  //   });
  // });
});

