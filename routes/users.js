const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  createUser,
  editProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/:userId', getUserById);

router.post('/', createUser);

router.patch('/me', editProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
