const express = require("express");
const router = express.Router();

const { isLoggedIn } = require('../middleware/users')
const { createContent } = require("../controller/content");

router
  .route("/")
  // .get(getContent)
  .post(isLoggedIn, createContent);
// .put(updateContent)
// .delete(deleteContent);

module.exports = router;
