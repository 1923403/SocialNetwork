const express = require("express");
const router = express.Router();
const {
  alreadyExists,
  isValid,
  isAvailable,
  validateUpdate,
  isLoggedIn,
  isOwner,
} = require("../middleware/users");

const {
  create,
  deleteUser,
  login,
  update,
  getProfile,
} = require("../controller/users");

router.post("/create", isAvailable, alreadyExists, isValid, create);

router.delete("/delete", isLoggedIn, isOwner, deleteUser);

router.post("/login", login);

router.put("/update", isLoggedIn, isOwner, validateUpdate, update);

router.get("/:id", isLoggedIn, getProfile);

module.exports = router;
