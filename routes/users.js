const express = require('express');

const authController = require('../controllers/authController')
const { userSignUpValidator } = require('../middlewares/userValidator')

const router = express.Router();




// @route     POST api/users
router.post('/signup', userSignUpValidator, authController.create_user)




module.exports = router;