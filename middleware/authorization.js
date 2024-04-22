const jwt = require('jsonwebtoken')
const { User } = require('../models/users')

const { httpErrors } = require('./index')

const { SECRET_KEY } = process.env

const authorization = async (req, res, next) => {
	const { authorization = '' } = req.headers

	const [bearer, token] = authorization.split(' ')

	if (bearer !== 'Bearer') {
		next(httpErrors(401))
	}

	try {
		const { id } = jwt.verify(token, SECRET_KEY)
		const user = await User.findOne({ where: { id } })

		if (!user || !user.token || user.token !== token) {
			next(httpErrors(401), 'User not found')
		}

		req.user = user
		next()
	} catch (error) {
		next(httpErrors(401))
	}
}
module.exports = authorization
