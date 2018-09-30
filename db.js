const dotenv = require('dotenv')
dotenv.config()
const { Client } = require('pg')

const db_opt = {
  host: process.env.pSQL_host,
  port: process.env.pSQL_port,
  username: process.env.pSQL_user,
  password: process.env.pSQL_password,
  database: process.env.pSQL_database
}

const db = {
  insert: async (q) => {
    const client = new Client(db_opt)
    await client.connect()
    try {
      await client.query(q)
      await client.end()
      return true
    } catch (e) {
      console.error("Errore nel fare la query: ", e.message);
      await client.end()
      return false;
    }
  },
  read: async (q) => {
    const client = new Client(db_opt)
    await client.connect()
    let res = undefined;
    try {
      res = await client.query(q)
      await client.end()
      return await res
    } catch (e) {
      console.error("Errore nel fare la query: ", e.message);
      await client.end()
      return e;
    }
  }
}
module.exports = db;