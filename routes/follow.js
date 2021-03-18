const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/users");
const { follow } = require("../controller/follow");

router.post("/:id", isLoggedIn, follow);

module.exports = router;
