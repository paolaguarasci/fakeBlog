const db = require('../db');

describe("Preliminari", () => {
  test("Funzione importata corretamente", () => {
    return db('SELECT * FROM student').then((res) => {
      expect(res).not.toBeUndefined();
    });
  });
  test("Return an array", () => {
    return db('SELECT * FROM student').then((res) => {
      expect(res.rows instanceof Array).toBe(true);
    });
  });
});

describe("CRUD", () => {
  test("Add row", () => {
    let query = "INSERT INTO asd values(7, 'Ciccio Pasticcio', 44444);";

    db(query).then((res) => {
      try {
        expect(res.rowCount > 0).toBe(true);
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

