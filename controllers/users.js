const connectionDB = require('../config/db/mysql')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const bcrypt = require('bcrypt')

const { User, schemas } = require('../models/users')

const { SECRET_KEY } = process.env

const getAllUsers = async (req, res) => {
	try {
		const page = req.query.page || 1
		const limit = parseInt(req.query.limit) || 10

		if (isNaN(page) || isNaN(limit)) {
			return res.status(400).json({ error: 'Invalid page or limit parameter' })
		}

		const users = await User.findAll({
			limit,
			offset: (page - 1) * limit,
		})

		console.log(req.query)

		res.status(200).json(users)
	} catch (error) {
		console.error('Error fetching users:', error)
		res.status(500).json({ error: 'Error fetching users' })
	}
}

const register = async (req, res) => {
	try {
		const validationResult = schemas.registerSchema.validate(req.body)

		if (validationResult.error) {
			res.status(400).json({ message: validationResult.error.message })
			return
		}

		const { email, phone, password } = req.body
		const userEmail = await User.findOne({ where: { email } })
		const userPhone = await User.findOne({ where: { phone } })

		if (userEmail || userPhone) {
			if (userEmail) return res.status(409).json({ message: 'Email already in use' })
			if (userPhone) return res.status(409).json({ message: 'Phone number already in use' })
		}

		const hashPassword = await bcrypt.hash(password, 10)

		const addedUser = await User.create({ ...req.body, password: hashPassword })
		console.log(addedUser)
		res.status(201).json(addedUser)
	} catch (error) {
		if (error) {
			const err = { message: error.errors[0].message }
			res.status(500).json(err)
		}
	}
}

const login = async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ where: { email } })
	if (!user) {
		return res.status(401).json({ message: 'Email is invalid' })
	}

	const passwordCompare = await bcrypt.compare(password, user.password)

	if (!passwordCompare) {
		return res.status(401).json({ message: 'Password is invalid' })
	}

	const payload = {
		id: user.id,
	}

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' })

	const updateUserToken = await User.findByPk(user.id)

	if (updateUserToken) {
		await updateUserToken.update({ token })
	}

	res.json({
		token,
	})
}

const getCurrentUser = async (req, res) => {
	const { email, name, id } = req.user
	console.log(id)
	res.json({
		email,
		name,
	})
}

const logout = async (req, res) => {
	const { id } = req.user

	const userById = await User.findByPk(id)

	await userById.update({ token: '' })

	res.json({
		message: 'Logout Success',
	})
}

module.exports = { getAllUsers, register, login, getCurrentUser, logout }
