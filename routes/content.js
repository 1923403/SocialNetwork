const express = require('express');
const router = express.Router();

router.route('/')
  .get(getContent)
  .post(createContent)
  .put(updateContent)
  .delete(deleteContent);

module.exports = router;