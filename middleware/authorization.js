const jwt = require('jsonwebtoken')
const { User } = require('../models/users')

const { SECRET_KEY } = process.env

const authorization = async (req, res, next) => {
	const { authorization = '' } = req.headers

	const [bearer, token] = authorization.split(' ')

	if (bearer !== 'Bearer') {
		// return next(httpErrors(401))
		return next(res.status(401).json({ error: 'Unauthorized' }))
	}

	try {
		const { id } = jwt.verify(token, SECRET_KEY)
		const user = await User.findOne({ where: { id } })

		if (!user || !user.token || user.token !== token) {
			// return next(httpErrors(401, 'User not found'))
			return next(res.status(401).json({ error: 'Unauthorized' }))
		}

		req.user = user
		next()
	} catch (error) {
		// return next(httpErrors(401))
		next(res.status(401).json({ error: 'Unauthorized' }))
	}
}

module.exports = authorization
