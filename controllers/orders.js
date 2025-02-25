const { Orders, ordersScheme } = require("../models/orders");
const { OrderItems } = require("../models/orderItems");
const { User } = require("../models/users");
const { Cart } = require("../models/cart");
const { ProductsItem } = require("../models/productsItem");
const { io } = require("../server");
const countTotalPriceWithTax = require("../helpers/countTax");
const sendEmail = require("../helpers/sendEmail");
const { Op } = require("sequelize");
const {
  createApprovedOrderText,
  createOrderReceivedText,
  createOrderReadyText,
  createOrderCancelledText,
} = require("../helpers/textLayouts");

// Get all active orders
const getActiveOrdersForToday = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const allActiveOrders = await Orders.findAll({
      where: {
        status: {
          [Op.ne]: "Picked up", // remove orders with status "Picked Up"
        },
      },
      order: [["id", "DESC"]],
      limit: Number(limit),
      offset: (page - 1) * Number(limit),
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: ProductsItem,
              attributes: ["id", "name", "price", "image"],
            },
          ],
        },
        {
          model: User,
          attributes: [
            "name",
            "last_name",
            "email",
            "phone",
            "additional_information",
            "image",
          ],
        },
      ],
    });

    res.status(200).json(allActiveOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all orders" });
  }
};

// clone function for updating data throw the socket
const fetchAllOrdersSocket = async () => {
  const { page = 1, limit = 10 } = { page: 1, limit: 10 };

  const result = await Orders.findAll({
    order: [["id", "DESC"]],
    limit: Number(limit),
    offset: (page - 1) * Number(limit),
    include: {
      model: OrderItems,
      include: [
        {
          model: ProductsItem,
          attributes: ["id", "name", "price", "image"],
        },
      ],
    },
  });

  const addUsersToResponse = await Promise.all(
    result.map(async (item) => {
      const eachUser = await User.findOne({ where: { id: item.user_id } });
      const orderData = item.toJSON();
      return { ...orderData, user: eachUser };
    })
  );

  const lastAddedOrder = addUsersToResponse[0];
  return lastAddedOrder;
};

// Get all orders for today
const getAllTodayOrders = async (req, res) => {
  const targetStatus = "Picked Up";

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const todayOrders = await Orders.findAll({
      where: {
        order_date: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      include: [
        {
          model: User,
          attributes: ["name", "last_name", "email", "phone", "image"],
        },
        {
          model: OrderItems,
          include: {
            model: ProductsItem,
            attributes: ["id", "name", "price", "image"],
          },
        },
      ],
    });

    const totalMoneyFromAllOrders = todayOrders
      .filter((order) => order.status === targetStatus)
      .reduce((acc, order) => acc + parseFloat(order.total_price), 0);

    const formattedTotal = totalMoneyFromAllOrders.toFixed(2);

    return res.status(200).json({
      todayOrders: todayOrders,
      totalMoneyFromAllOrders: formattedTotal,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Error getting all orders for today", error });
  }
};

// Get all orders by date
const getOrdersForThisDay = async (req, res) => {
  const { date } = req.body;
  const targetStatus = "Picked Up";

  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const ordersForThisDay = await Orders.findAll({
      where: {
        order_date: {
          [Op.gte]: startOfDay,
          [Op.lt]: endOfDay,
        },
      },
      include: [
        {
          model: User,
          attributes: ["name", "last_name", "email", "phone"],
        },
        {
          model: OrderItems,
          include: {
            model: ProductsItem,
            attributes: ["id", "name", "price", "image"],
          },
        },
      ],
    });

    if (!ordersForThisDay.length) {
      return res.status(404).json({
        message: "No orders found for this day",
        orders: [],
        totalMoneyFromAllOrders: "0",
      });
    }

    const totalMoneyFromAllOrders = ordersForThisDay
      .filter((order) => order.status === targetStatus)
      .reduce((acc, order) => acc + parseFloat(order.total_price), 0);

    const formattedTotal = totalMoneyFromAllOrders.toFixed(2);

    return res.status(200).json({
      orders: ordersForThisDay,
      totalMoneyForThisDay: formattedTotal,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving orders", error });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count } = await Orders.findAndCountAll({
      where: { user_id: userId },
    });

    const response = await Orders.findAll({
      where: { user_id: userId },
      include: [
        {
          model: OrderItems,
          include: [
            {
              model: ProductsItem,
              attributes: ["id", "name", "price", "image"],
            },
          ],
        },
      ],
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
    });

    const result = response.map(
      ({
        id,
        status,
        total_price,
        order_date,
        chopsticks,
        chopsticks_quantity,
        soy_sauce,
        allergic,
        type_of_allergy,
        additional_information,
        order_items,
      }) => ({
        id,
        status,
        totalPrice: total_price,
        order_date,
        chopsticks,
        chopsticks_quantity,
        soy_sauce,
        allergic,
        type_of_allergy,
        additional_information,
        order_items: order_items.map(
          ({ id, quantity, price, createdAt, products_item }) => ({
            id,
            quantity,
            price,
            createdAt,
            product: products_item,
          })
        ),
      })
    );
    res.status(200).json({
      result,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      totalItems: count,
      itemsPerPage: 5,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all user orders" });
  }
};

const getOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await OrderItems.findAll({ where: { order_Id: orderId } });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order items" });
  }
};

const addOrder = async (req, res) => {
  try {
    const itemsInCart = await Cart.findAll({
      where: { users_id: req.body.user_id },
    });

    if (itemsInCart.length === 0) {
      return res.status(409).json({ message: "Your cart is empty" });
    }

    let calcTotalPrice = itemsInCart.reduce(
      (total, { price }) => total + +price,
      0
    );

    // Creating an order
    const order = await Orders.create({
      ...req.body,
      total_price: +calcTotalPrice.toFixed(2),
    });

    // Binding to user
    const user = await User.findByPk(req.body.user_id);
    await user.addOrder(order);

    // Adding items to order
    if (itemsInCart && itemsInCart.length > 0) {
      await OrderItems.bulkCreate(
        itemsInCart.map(({ products_item_id, quantity, price }) => ({
          order_id: order.id,
          products_item_id,
          quantity,
          price,
        }))
      );
    }

    const updatedOrders = await fetchAllOrdersSocket();
    io.emit("NEW_ORDER", updatedOrders);

    if (order.status === "Pending") {
      sendEmail(user.email, user.name, createOrderReceivedText(user.name));
    }

    res.status(201).json(order);

    await Cart.destroy({ where: { users_id: req.body.user_id } });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create an order" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status: newStatus } = req.body;

    const validStatuses = ["Pending", "In Process", "Picked Up", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Orders.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = newStatus;
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

const updateOrderStatusStaff = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status: newStatus } = req.body;
    console.log(newStatus);

    const validStatuses = [
      "Pending",
      "In Process",
      "Picked Up",
      "Cancelled",
      "Completed",
    ];

    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const order = await Orders.findOne({ where: { id: orderId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const user = await User.findOne({ where: { id: order.user_id } });

    order.status = newStatus;
    await order.save();

    if (newStatus === "In Process") {
      sendEmail(
        user.email,
        user.name,
        createApprovedOrderText(user.name, req.body.time)
      );
    }

    if (newStatus === "Completed") {
      sendEmail(user.email, user.name, createOrderReadyText(user.name));
    }

    if (newStatus === "Cancelled") {
      sendEmail(
        user.email,
        user.name,
        createOrderCancelledText(user.name, orderId)
      );
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    await Orders.destroy({ where: { id: orderId } });
    res.status(200).json({ message: "Order was delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleted", error });
  }
};

module.exports = {
  getActiveOrdersForToday,
  getAllTodayOrders,
  getOrdersForThisDay,
  getUserOrders,
  getOrderItems,
  addOrder,
  updateOrderStatus,
  updateOrderStatusStaff,
  deleteOrder,
};
