const dotenv = require('dotenv')
dotenv.config()
const { Pool } = require('pg')

const db_opt = {
  host: process.env.pSQL_host,
  port: process.env.pSQL_port,
  username: process.env.pSQL_user,
  password: process.env.pSQL_password,
  database: process.env.pSQL_database
}

class db {
  constructor() {
    const pool = new Pool(db_opt);

    // Getter (user and posts)
    this.user = async (nickname) => {
      const raw__query = `SELECT nickname, email, id FROM users WHERE nickname = '${nickname}';`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.getEmail = async (id) => {
      const raw__query = `SELECT email  FROM users WHERE id = '${id}';`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };

    this.users = async () => {
      const raw__query = `SELECT nickname FROM users`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.getUserInfo = async (email) => {
      const raw__query = `SELECT * FROM users WHERE email = '${email}'`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.findOne = async (key) => {
      console.log(key)
      const raw__query = `SELECT * FROM users WHERE email='${key.Email}' AND password='${key.Pass}';`;
      console.log("Full Query", raw__query);
      const user = await raw(raw__query);
      // if (!user) return new Error('User not found');
      // console.log('id', user[0].id);
      return user[0];
    };

    this.post = async (user) => {
      const raw__query = `SELECT title, body, posts.id FROM posts JOIN users on (posts.author = users.id) WHERE users.id = '${user}'`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.getUserPost = async (email) => {
      const raw__query = `SELECT title, body, posts.id FROM posts JOIN users on (posts.author = users.id) WHERE users.email = '${email}'`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.singlePost = async (id) => {
      const raw__query = `SELECT title, body, posts.id, author FROM posts JOIN users on (posts.author = users.id) WHERE posts.id = '${id}'`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.latest20Post = async (user) => {
      const raw__query = `SELECT title, body, posts.id, author FROM posts ORDER BY id DESC LIMIT 20`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };

    this.deleteUser = async (nickname) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `DELETE FROM users WHERE nickname = '${nickname}';`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.deletePost = async (post) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `DELETE FROM posts WHERE id = '${post}';`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.addUser = async (user) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `INSERT INTO users VALUES('${user.nickname}', '${user.email}', '${user.password}');`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.addPost = async (post) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `INSERT INTO posts VALUES('${post.title}', '${post.body}', '${post.author}');`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.updateUser = async (user) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `
        UPDATE users
        SET nickname = '${user.nickname}', email = '${user.email}', password = '${user.password}'
        WHERE id = ${user.id}
        RETURNING nickname, email, id;`;
      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };
    this.updatePost = async (post) => {
      // TODO inserire un ritorno che indichi lo stato delle cose
      const raw__query = `
        UPDATE posts
        SET title = '${post.title}', body = '${post.body}'
        WHERE id = ${post.id}
        RETURNING title, body, id;`;

      console.log("Full Query", raw__query);
      return await raw(raw__query);
    };

    const raw = async (raw, param) => {
      try {
        let res = await pool.query(raw, param)
        return await res.rows
      } catch (e) {
        console.error("Errore nel fare la query: ", e.message);
        return e;
      }
    };
  }

  // this.user = async (nick) => {
  //   return read('users', nick);
  // }
  // this.json = async (obj) => {
  //   return JSON.parse(obj);
  // }

  // this.insertPost = async (author, title, body) => {
  //   const client = new Client(db_opt)
  //   await client.connect()
  //   try {
  //     await client.query(q)
  //     await client.end()
  //     return true
  //   } catch (e) {
  //     console.error("Errore nel fare la query: ", e.message);
  //     await client.end()
  //   }
  // }
  // this.readPost = async (user, id) => {
  //   const client = new Client(db_opt)
  //   await client.connect()
  //   const fullQuery = `
  //       SELECT title, body, nickname
  //       FROM posts JOIN users on (posts.author = users.users_id)
  //       WHERE users.nickname = '${user}'
  //       AND posts.post_id = ${id};
  //       `;
  //   let res = undefined;
  //   try {
  //     res = await client.query(fullQuery)
  //     await client.end()
  //     return await res
  //   } catch (e) {
  //     console.error("Errore nel fare la query: ", e.message);
  //     await client.end()
  //     return e;
  //   }
  // }
  // this.deletePost = async (id) => {
  //   const client = new Client(db_opt)
  //   await client.connect()
  //   const q = `DELETE FROM posts WHERE posts_id = ${id}`;
  //   let res = undefined;
  //   try {
  //     res = await client.query(q)
  //     await client.end()
  //     return await res
  //   } catch (e) {
  //     console.error("Errore nel fare la query: ", e.message);
  //     await client.end()
  //     return e;
  //   }
  // }
  // this.updatePost = async (id, newTitle, newBody) => {
  //   const client = new Client(db_opt)
  //   await client.connect()
  //   let res = undefined;
  //   try {
  //     res = await client.query(q)
  //     await client.end()
  //     return await res
  //   } catch (e) {
  //     console.error("Errore nel fare la query: ", e.message);
  //     await client.end()
  //     return e;
  //   }
  // }
}
module.exports = db;