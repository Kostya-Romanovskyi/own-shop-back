const { createConnection } = require('mysql')
require('dotenv').config()

const connectionDB = createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
})

connectionDB.connect(err => {
	let message = !err ? `DB connected` : `Connection failed`
	console.log(message)
})

module.exports = connectionDB
