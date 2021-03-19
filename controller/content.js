const { db } = require("../lib/db");
const uuid = require("uuid");
const multer = require("multer");

exports.createContent = (req, res) => {
  const { title, contentName, description } = req.body;
  const userId = req.userData.userId;
  console.log("userId:");
  console.log(userId);
  console.log(req.body);

  const sql = `INSERT INTO content (id, user_id, title, content, description, created_at) VALUES (${db.escape(
    uuid.v4()
  )}, '${userId}', ${db.escape(title)}, ${db.escape(contentName)}, ${db.escape(
    description
  )}, now());`;

  db.query(sql, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Cannot insert into database" });
    }
  });

  return res.status(201).send({ msg: "Content added to database" });
};

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

exports.storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let err = new Error("Invalid mime type");
    if (isValid) {
      err = null;
    }
    callback(err, "./data/imageData");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    const fullName = name + "-" + Date.now() + "." + ext;
    req.body.contentName = fullName;
    callback(null, fullName);
  },
});

exports.getContent = (userName) => {
  const sql = `SELECT content.id, content.title, content.content, content.description, content.created_at 
  FROM content 
  INNER JOIN users
  ON users.id = content.user_id
  WHERE LOWER(users.user_name) = LOWER(${db.escape(userName)})
  ORDER BY content.created_at DESC;`;

  return new Promise(resolve => {
    db.query(sql, (err, result)=> {
      if(err)
        console.log(err)
      let posts = [];
      if(result)
        for(let i = 0; i< result.length; i++){
          const post = {
            id : result[i].id,
            title: result[i].title,
            content: result[i].content,
            description: result[i].description,
            createdAt: result[i].created_at
          }
          posts.push(post);
        }
      resolve(posts);
    })
  })
}
