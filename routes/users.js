const express = require('express');
const router = express.Router();
const {alreadyExists, isValid, isAvailable, validateUpdate} = require('../middleware/users');

const { create, deleteUser, login, update } = require('../controller/users')

router.post("/create", isAvailable, alreadyExists, isValid, create);

router.delete("/delete", deleteUser);

router.post("/login", login);

router.put("/update", validateUpdate, update)

module.exports = router;