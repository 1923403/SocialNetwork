const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "social_network",
});
db.connect();

db.query = util.promisify(db.query);

async function exists(table, column, value) {
  const sql = `SELECT ${column} FROM ${table} WHERE LOWER(${column}) = LOWER(${db.escape(
    value
  )});`;
  const result = await db.query(sql);
  console.log(result);
  console.log(result.length > 0);
  return result.length > 0;
}

module.exports = { db, exists };
