const { app } = require("./server");

const cors = require("cors");
require("dotenv").config();

require("./models/associationsOfModels");

app.use(cors());

const userRouter = require("./routes/auth/users");
const userOrdersRouter = require("./routes/api/users");
const categoriesRouter = require("./routes/api/categories");
const productsRouter = require("./routes/api/products");
const productsItemRouter = require("./routes/api/productsItem");
const ordersRouter = require("./routes/api/orders");
const orderItemsRouter = require("./routes/api/orderItems");
const cartRouter = require("./routes/api/cart");
const ingredientsRouter = require("./routes/api/ingredients");
const reservationRouter = require("./routes/api/reservations");

app.use("/api", userRouter);
app.use("/api", userOrdersRouter);
app.use("/api", categoriesRouter);
app.use("/api", productsRouter);
app.use("/api", productsItemRouter);
app.use("/api", ordersRouter);
app.use("/api", orderItemsRouter);
app.use("/api", cartRouter);
app.use("/api", ingredientsRouter);
app.use("/api", reservationRouter);

// Error Handlers
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
