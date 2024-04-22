const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config()
const Joi = require('joi')
const myCustomJoi = Joi.extend(require('joi-phone-number'))

const sequelize = new Sequelize({
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
})

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/

const User = sequelize.define(
	'users',
	{
		id: {
			type: DataTypes.INTEGER(11),
			primaryKey: true,
			autoIncrement: true,
		},

		name: DataTypes.STRING,

		last_name: DataTypes.STRING,

		email: {
			type: DataTypes.STRING(EMAIL_REGEX),
			allowNull: false,
			unique: true,
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},

		phone: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},

		additional_information: DataTypes.STRING,

		role: {
			type: DataTypes.ENUM('admin', 'user'),
			allowNull: false,
		},

		image: DataTypes.STRING,

		createdAt: DataTypes.DATE,

		updatedAt: DataTypes.DATE,

		token: {
			type: DataTypes.STRING,
			defaultValue: '',
		},
	},
	{
		tableName: 'users',
	}
)

const registerSchema = Joi.object({
	id: Joi.number(),
	name: Joi.string().min(2).required(),
	last_name: Joi.string().min(2).required(),
	email: Joi.string().pattern(EMAIL_REGEX).required(),
	password: Joi.string().min(6).max(25).required(),
	phone: myCustomJoi.string().phoneNumber().required(),
	additional_information: Joi.string().optional(),
	role: Joi.string().required(),
	image: Joi.string().optional(),
	createdAt: Joi.date().timestamp().default(Date.now),
	updatedAt: Joi.date().timestamp(),
	token: Joi.string(),
})

const loginSchema = Joi.object({
	email: Joi.string().pattern(EMAIL_REGEX).required(),
	password: Joi.string().min(6).max(25).required(),
})

const schemas = {
	registerSchema,
	loginSchema,
}

module.exports = { User, schemas }
