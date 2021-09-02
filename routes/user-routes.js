const express = require('express');

const getAllUsers = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

const getUserById = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

const addNewUser = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

const updateUser = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

const deleteUserById = (req, res) => {
  res.status(500).send({
    status: 'Invalid',
    message: 'THis API is not implemented'
  });
};

const router = express.Router();

router.route('/').get(getAllUsers).post(addNewUser);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUserById);

module.exports = router;
