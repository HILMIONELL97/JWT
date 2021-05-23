const express = require('express');
const userController = require('../controllers/authController')
const { userSignInValidator } = require('../middlewares/userValidator')
const { auth } = require('../middlewares/authValidation')
const router = express.Router();





// @route     POST api/auth
router.post('/signin', userSignInValidator, userController.login_user)

// @route     GET api/auth
// @access    Private
router.get('/', auth, userController.getLoggedIn)




module.exports = router;