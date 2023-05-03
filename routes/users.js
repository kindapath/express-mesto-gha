const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  editProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { validateUserId, validateEditProfile, validateAvatar } = require('../middlewares/validations');

router.get('/', getAllUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateEditProfile, editProfile);

router.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = router;
