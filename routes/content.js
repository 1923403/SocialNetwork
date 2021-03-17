const express = require("express");
const router = express.Router();

const { isLoggedIn } = require("../middleware/users");
const { requirementsFullfilled } = require("../middleware/content");
const { createContent, storage } = require("../controller/content");
const multer = require("multer");

router
  .route("/")
  // .get(getContent)
  .post(
    isLoggedIn,
    requirementsFullfilled,
    multer({ storage: storage }).single("content"),
    createContent
  );
// .put(updateContent)
// .delete(deleteContent);

module.exports = router;
