const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
require("dotenv").config();
const Joi = require("joi");
const { Orders } = require("./orders");
const { OrderItems } = require("./orderItems");
const { Reservations } = require("../models/reservations");
const myCustomJoi = Joi.extend(require("joi-phone-number"));

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

const User = sequelize.define(
  "users",
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
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
    },

    image: DataTypes.STRING,

    token: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
  }
);

const registerSchema = Joi.object({
  id: Joi.number(),
  name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2).required(),
  email: Joi.string().pattern(EMAIL_REGEX).required(),
  password: Joi.string().min(6).max(25).required(),
  password_check: Joi.string().min(6).max(25).required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  additional_information: Joi.string().optional(),
  role: Joi.string().required(),
  image: Joi.optional(),
  createdAt: Joi.date().timestamp().default(Date.now),
  updatedAt: Joi.date().timestamp(),
  token: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(EMAIL_REGEX).required(),
  password: Joi.string().min(6).max(25).required(),
});

const updateSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  last_name: Joi.string().min(2).optional(),
  email: Joi.string().pattern(EMAIL_REGEX).optional(),
  password: Joi.string().min(6).max(25).optional(),
  password_check: Joi.string().min(6).max(25).optional(),
  phone: myCustomJoi.string().phoneNumber().optional(),
  additional_information: Joi.string().optional(),
  image: Joi.optional(),
});

const schemas = {
  registerSchema,
  loginSchema,
  updateSchema,
};

User.hasMany(Orders, { foreignKey: "user_id" });
// User.hasMany(Orders, { foreignKey: "user_id", as: "orders" });

// User.hasMany(OrderItems, { foreignKey: 'order_items' })

module.exports = { User, schemas };
