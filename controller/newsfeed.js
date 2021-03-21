const { db } = require("../lib/db");

exports.getNewsfeed = (req, res) => {
  //just for testing frontend
  const header = req.headers;
  const sql = `SELECT users.user_name, content.title, content.content, content.description, content.created_at 
    FROM content 
    INNER JOIN users 
    ON content.user_id = users.id 
    ORDER BY content.created_at DESC;`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "internal sql error" });
    }
    let posts = [];
    for (let i = 0; i < result.length; i++) {
      const user = {
        name: result[i]["user_name"],
        profilePicture: getRandomImg(),
        post: {
          title: result[i]["title"],
          description: result[i]["description"],
          createdAt: result[i]["created_at"],
          content: result[i]["content"],
        },
      };
      posts.push(user);
    }
    return res.status(200).send({ msg: posts });
  });
};

function getRandomImg() {
  return Math.random() > 0.5
    ? "http://localhost:3000/image/img_avatar_m.png"
    : "http://localhost:3000/image/img_avatar_w.png";
}
