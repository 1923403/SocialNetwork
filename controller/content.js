const { db } = require("../lib/db");
const uuid = require("uuid");

exports.createContent = (req, res) => {
  const { userName, title, content, description } = req.body;
  console.log(req.body);

  const sql = `SELECT id FROM users WHERE LOWER(user_name) = LOWER(${db.escape(
    userName
  )})`;
  db.query(sql, (err, result) => {
    if (err || result.length === 0) {
      console.log(err);

      return res.status(500).send({ msg: "Cannot insert into database" });
    }
    const userId = result[0]["id"];

    const sql = `INSERT INTO content (id, user_id, title, content, description, created_at) VALUES (${db.escape(
      uuid.v4()
    )}, '${userId}', ${db.escape(title)}, ${db.escape(content)}, ${db.escape(
      description
    )}, now());`;

    db.query(sql, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Cannot insert into database" });
      }
    });

    return res.status(201).send({ msg: "Content added to database" });
  });
};
