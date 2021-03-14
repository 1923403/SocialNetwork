const express = require("express");
const router = express.Router();

const { getNewsfeed } = require("../controller/newsfeed");

router.get("/", getNewsfeed);

module.exports = router;
