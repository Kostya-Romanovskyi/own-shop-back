const express = require('express')
const router = express.Router()
const usersCtrl = require('../../controllers/users')
const authorization = require('../../middleware/authorization')

// get all users
router.get('/auth/users', authorization, usersCtrl.getAllUsers)

//register
router.post('/auth/register', usersCtrl.register)

//login
router.post('/auth/login', usersCtrl.login)

//check current user
router.get('/auth/current', authorization, usersCtrl.getCurrentUser)

//logout
router.post('/auth/logout', authorization, usersCtrl.logout)

module.exports = router
