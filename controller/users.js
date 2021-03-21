const { db } = require("../lib/db");
const uuid = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getContent } = require("./content");
const { getFollower, getFollowing } = require("./follow");

exports.create = (req, res) => {
  const password = req.body.password;

  bcrypt.hash(password, 10, (err, hash) => {
    const sql = `INSERT INTO users(id, user_name, email, password, visibility, last_login, created_at) 
        VALUES(${db.escape(uuid.v4())}, ${db.escape(req.body.userName)}, 
        ${db.escape(req.body.email)}, ${db.escape(hash)}, 
        ${db.escape(req.body.visibility)}, null, now());`;
    db.query(sql, (err, result) => {
      if (err) {
        res.status(500).send({ msg: err });
      } else {
        res.status(201).send({ msg: `${req.body.userName} was created` });
      }
    });
  });
};

exports.login = (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).send({ msg: "Missing username or password" });
  }
  const sql = `SELECT password, id FROM users WHERE LOWER(user_name) = LOWER(${db.escape(
    userName
  )})`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).send({ msg: "Internal error" });
    }
    if (!result.length) {
      return res.status(401).send({ msg: "Username or password incorrect" });
    }
    if (!bcrypt.compareSync(password, result[0]["password"])) {
      return res.status(401).send({ msg: "Username or password incorrect" });
    }
    const token = jwt.sign(
      { id: result[0]["id"] },
      "dadawafasfEEAFAEafeaar234r3qw",
      { expiresIn: "1h" }
    );

    const sql = `UPDATE users SET last_login = now() WHERE LOWER(user_name) = LOWER(${db.escape(
      userName
    )});`;
    db.query(sql, (err, result) => {
      if (err) console.log(err);
    });

    return (
      res
        .status(200)
        // .cookie("token", token)
        .send({
          msg: "logged in",
          user: userName,
          expiresIn: "3600", //for setting timer in frontend
          token: token,
        })
    );
  });
};

exports.update = (req, res) => {
  const {
    userName,
    newUserName,
    newEmail,
    newPassword,
    newVisibility,
  } = req.body;
  let sql = `UPDATE users SET`;
  if (newUserName) {
    sql += ` user_name = ${db.escape(newUserName)},`;
  }
  if (newEmail) {
    sql += ` email = ${db.escape(newEmail)},`;
  }
  if (newPassword) {
    const hash = bcrypt.hashSync(newPassword, 10);
    sql += ` password = ${db.escape(hash)},`;
  }
  if (
    newVisibility ||
    newVisibility === "public" ||
    newVisibility === "private"
  ) {
    sql += ` visibility = ${db.escape(newVisibility)},`;
  }

  sql = sql.slice(0, -1);
  sql += ` WHERE LOWER(user_name) = LOWER(${db.escape(req.body.userName)})`;

  db.query(sql, (err, result) => {
    console.log(sql);
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "can not update" });
    }
    return res.status(200).send({ msg: `updated user ${userName}` });
  });
};

exports.deleteUser = (req, res) => {
  const sql = `DELETE FROM users WHERE LOWER(user_name) = LOWER(${db.escape(
    req.body.userName
  )})`;
  db.query(sql, (err, result) => {
    if (err) {
      res
        .status(500)
        .send({ msg: `${req.body.userName} could not be deleted` });
    } else {
      res.status(200).send({ msg: `${req.body.userName} was deleted` });
    }
  });
};

function getUser(req) {
  const profileName = req.params.id;
  const ownUserId = req.userData.userId;
  const sql = `SELECT users.id, users.user_name, users.email, users.visibility, (SELECT IF((${db.escape(
    ownUserId
  )} = users.id), 'owner', follows.state)) AS state
  FROM users
  LEFT JOIN follows
  ON users.id = follows.user_id AND (follows.follower_id = ${db.escape(
    ownUserId
  )})
  WHERE LOWER(users.user_name) = LOWER(${db.escape(profileName)});`;
  return new Promise((resolve) => {
    console.log(sql);
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
        return null;
      }
      const user = {
        name: profileName,
        email: result[0].email,
        state: result[0].state,
        profilePicture: getRandomImg(),
      };
      resolve(user);
    });
  });
}

function getRandomImg() {
  return Math.random() > 0.5
    ? "http://localhost:3000/image/img_avatar_m.png"
    : "http://localhost:3000/image/img_avatar_w.png";
}

exports.getProfile = async (req, res) => {
  const userName = req.params.id;
  const user = await getUser(req);
  if (!user) {
    return res.status(404).send({ msg: "user not found" });
  }
  const content = await getContent(userName);
  const follower = await getFollower(userName);
  const following = await getFollowing(userName);
  user.posts = content;
  user.follower = follower;
  user.following = following;
  console.log(user);
  res.status(200).send({ user });
};
