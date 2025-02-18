const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");
const Joi = require("joi");

const Reservations = sequelize.define(
  "reservations",
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    guest_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    with_children: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    table_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Success", "Cancelled"),
      defaultValue: "Pending",
    },
  },
  {
    timestamps: true,
    tableName: "reservations",
  }
);

const createReservationScheme = Joi.object({
  id: Joi.number().integer().positive(),
  start_time: Joi.date().required(),
  guest_count: Joi.number().required(),
  with_children: Joi.boolean().required(),
  user_id: Joi.number().required(),
  table_number: Joi.number().max(8).required(),
  status: Joi.string().required(),
});
const updateStatusScheme = Joi.object({
  status: Joi.string().required(),
});

const schemes = {
  createReservationScheme,
  updateStatusScheme,
};

// Reservations.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = { Reservations, schemes };
