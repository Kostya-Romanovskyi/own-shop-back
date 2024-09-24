const express = require('express')
const router = express.Router()

const usersCtrl = require('../../controllers/auth/users')

const { authorization, upload } = require('../../middleware/index')

// get all users
router.get('/auth/users', usersCtrl.getAllUsers)

//register
router.post('/auth/register', upload.single('image'), usersCtrl.register)

//login
router.post('/auth/login', usersCtrl.login)

//check current user
router.get('/auth/current', authorization, usersCtrl.getCurrentUser)

// update user profile
router.patch('/auth/update-info/:userId', upload.single('image'), usersCtrl.updateUserProfile)

//logout
router.post('/auth/logout', authorization, usersCtrl.logout)

module.exports = router
