const { db } = require("../lib/db");

exports.follow = (req, res) => {
  const follower_id = req.userData.userId;
  const userName = req.params.id;
  const sql = `INSERT INTO follows(user_id, follower_id, state, created_at) 
        VALUES(${db.escape(follower_id)}, 

            (SELECT users.id 
            FROM users 
            WHERE LOWER(users.user_name) = LOWER(${db.escape(userName)}),

            (SELECT IF(users.visibility = 'public','accepted', 'pending') 
            FROM users 
            WHERE LOWER(users.user_name) = LOWER(${db.escape(userName)})),

            now()
        );`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "internal error" });
    }
    return res.status(201).send({ msg: "success" });
  });
};
