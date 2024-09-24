const express = require('express')
const connectionDB = require('./config/db/mysql')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const PORT = process.env.SERVER_PORT || 3000

app.listen(PORT, () => {
	console.log(`Server starts on PORT ${PORT}`)
})

module.exports = app
