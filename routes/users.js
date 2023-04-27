const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  editProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', getUserById);

router.patch('/me', editProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
