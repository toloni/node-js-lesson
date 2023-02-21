const express = require('express');
const userControllrer = require('./../controllers/userController');
const router = express.Router();

router
  .route('/')
  .get(userControllrer.getAllUsers)
  .post(userControllrer.createUser);
router
  .route('/:id')
  .get(userControllrer.getUser)
  .patch(userControllrer.updateUser)
  .delete(userControllrer.deleteUser);

module.exports = router;
