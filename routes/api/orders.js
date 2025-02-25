const express = require("express");
const {
  getActiveOrdersForToday,
  getAllTodayOrders,
  getOrdersForThisDay,
  getOrderItems,
  addOrder,
  getUserOrders,
  updateOrderStatus,
  updateOrderStatusStaff,
  deleteOrder,
} = require("../../controllers/orders");

const router = express.Router();

router.get("/orders", getActiveOrdersForToday);

router.get("/orders-all-today", getAllTodayOrders);

router.post("/orders-by-date", getOrdersForThisDay);

router.get("/:userId/orders", getUserOrders);

router.get("/orders/:orderId/items", getOrderItems);

router.post("/order", addOrder);

router.put("/update-status/:orderId", updateOrderStatus);

router.put("/update-status-staff/:orderId", updateOrderStatusStaff);

router.delete("/order/:orderId", deleteOrder);

module.exports = router;
