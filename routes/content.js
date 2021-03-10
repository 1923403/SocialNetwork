const express = require("express");
const router = express.Router();

const { createContent } = require("../controller/content");

router
  .route("/")
  // .get(getContent)
  .post(createContent);
// .put(updateContent)
// .delete(deleteContent);

module.exports = router;
