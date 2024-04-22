const express = require('express')
const router = express.Router()
const connectionDB = require('../../server')

router.get('/login', (req, res) => {
	connectionDB.query(`IMPORT * FROM admins`, (error, result) => {
		!error ? res.status(200).json(result) : res.status(500)
	})
})

module.exports = router
