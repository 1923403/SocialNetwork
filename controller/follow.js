const { db } = require("../lib/db");

exports.follow = (req, res) => {
  const follower_id = req.userData.userId;
  const userName = req.params.id;
  const sql = `INSERT INTO follows(user_id, follower_id, state, created_at) 
        VALUES((SELECT users.id 
          FROM users 
          WHERE LOWER(users.user_name) = LOWER(${db.escape(userName)})),
          
          ${db.escape(follower_id)}, 

            (SELECT IF(users.visibility = 'public','accepted', 'pending') 
            FROM users 
            WHERE LOWER(users.user_name) = LOWER(${db.escape(userName)})),
          
            now()
        );`;
        //168bf2ce-16f9-4e77-be13-e8ccd0231dbf
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "internal error" });
    }
    return res.status(201).send({ msg: "success" });
  });
};

exports.getFollower = (userName) => {
  const sql = `SELECT follows.follower_id, users.user_name
                          FROM follows
                          INNER JOIN users
                          ON follows.follower_id = users.id
                          WHERE follows.user_id = 
                          (SELECT users.id 
                            FROM users 
                            WHERE LOWER(users.user_name) = 
                            LOWER(${db.escape(userName)}))`;
  return new Promise(resolve => {
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
        let follower = []
        if(result)
          for(let i = 0; i< result.length; i++){
            follower.push({
              id: result[i].follower_id,
              userName: result[i].user_name
            })
          }
      resolve(follower);
    });
  });
};

exports.getFollowing = (userName) => {
  const sql = `SELECT follows.user_id, users.user_name
                          FROM follows
                          INNER JOIN users
                          ON follows.user_id = users.id
                          WHERE follows.follower_id = 
                          (SELECT users.id 
                            FROM users 
                            WHERE LOWER(users.user_name) = 
                            LOWER(${db.escape(userName)}))`;
  return new Promise(resolve => {
    db.query(sql, (err, result) => {
      if(err)
        console.log(err);
      let following = []
      if(result)
        for(let i = 0; i< result.length; i++){
          following.push({
            id: result[i].user_id,
            userName: result[i].user_name
          })
        }
      resolve(following);
    });
  });
}
