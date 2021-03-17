const express = require("express");
const router = express.Router();
const path = require("path");

//check authorization

router.get("/*", express.static(path.join("./data/imageData"))
);

module.exports = router;
