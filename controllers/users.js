const { User, schemas } = require("../models/users");
const { Orders } = require("../models/orders");
const { OrderItems } = require("../models/orderItems");

const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.findOne({
      include: [{ model: Orders, include: [{ model: OrderItems }] }],
      where: { id },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await User.findOne({ where: { id: userId } });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};

module.exports = { getUserOrders, getUserById };
