const { db } = require("../lib/db");
const uuid = require("uuid");
const multer = require("multer");

exports.createContent = (req, res) => {
  const { userId, userName, title, content, description } = req.body;
  console.log(req.body);
  console.log(userId);

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
    callback(err, "data/imageData");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase.split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  },
});
