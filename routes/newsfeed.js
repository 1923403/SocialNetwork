const express = require("express");
const router = express.Router();

const { getNewsfeed } = require("../controller/newsfeed");
const { isLoggedIn } = require("../middleware/users");

router.get("/", isLoggedIn, getNewsfeed);

module.exports = router;
