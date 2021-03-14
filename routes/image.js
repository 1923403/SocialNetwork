const express = require("express");
const router = express.Router();
const path = require("path");

//check authorization
console.log(path.join(__dirname, "..", "/data/image"));
router.get(
  "/*",
  (req, res, next) => {
    console.log("!");
    console.log(req.url);
    next();
  },
  express.static(path.join("./data/image"))
);

module.exports = router;
