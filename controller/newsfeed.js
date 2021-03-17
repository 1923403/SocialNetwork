const { db } = require("../lib/db");

exports.getNewsfeed = (req, res) => {
  //just for testing frontend
  const header = req.headers;
  console.log("header");
  console.log(header);
  const sql =
    "SELECT users.user_name, content.title, content.content, content.description, content.created_at FROM content INNER JOIN users ON content.user_id = users.id ORDER BY content.created_at DESC;";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "internal sql error" });
    }
    let items = [];
    console.log(result);
    for (let i = 0; i < result.length; i++) {
      items.push({
        userName: result[i]["user_name"],
        title: result[i]["title"],
        description: result[i]["description"],
        createdAt: result[i]["created_at"],
        content: result[i]["content"],
      });
    }
    return res.status(200).send({ msg: items });
  });
};
