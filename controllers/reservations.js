const { Reservations, schemes } = require("../models/reservations");
const { User } = require("../models/users");
const { Op } = require("sequelize");
const { io } = require("../server");
const sendEmail = require("../helpers/sendEmail");
const {
  createReceivedTableText,
  createTableConfirmedText,
  createCancelledTableText,
} = require("../helpers/textLayouts");

const addNewReservation = async (req, res) => {
  try {
    const validateBody = schemes.createReservationScheme.validate(req.body);
    if (validateBody.error) {
      return res.status(400).json({ message: validateBody.error.message });
    }

    const userExists = await User.findByPk(req.body.user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReservation = await Reservations.create(req.body);

    io.emit("NEW_RESERVATION", newReservation);

    if (newReservation.status === "Pending") {
      sendEmail(
        userExists.email,
        userExists.name,
        createReceivedTableText(userExists.name, newReservation)
      );
    }

    return res.status(201).json({
      message: "Reservation successfully added",
      reservationId: newReservation.id,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return res.status(500).json({ message: "Failed to add new reservation" });
  }
};

const getReservationByIdWithUser = async (req, res) => {
  try {
    const reservationId = req.params.user_id;

    const reservation = await Reservations.findOne({
      where: { id: reservationId },
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "last_name", "email", "phone"],
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reservation" });
  }
};

const getAllReservationsWithUser = async (req, res) => {
  try {
    const reservation = await Reservations.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "last_name", "email", "phone"],
        order: [["id", "DESC"]],
      },
    });

    if (!reservation) {
      return res.status(404).json({ message: "Reservations not found" });
    }

    return res.status(200).json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reservation" });
  }
};

const getAllUsersReservations = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const userId = req.params.user_id;

  try {
    // get all user`s reservations and count in total
    const totalItems = await Reservations.count({
      where: { user_id: userId },
    });

    const reservation = await Reservations.findAll({
      where: { user_id: userId },
      order: [["id", "DESC"]],
      limit,
      offset,
    });

    if (reservation.length === 0) {
      return res.status(404).json({ message: "Reservations not found" });
    }

    res.status(200).json({
      reservation,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving reservations" });
  }
};

const changeReservationStatus = async (req, res) => {
  const { reservationId } = req.params;

  const { status: newStatus } = req.body;

  try {
    const validateBody = schemes.updateStatusScheme.validate(req.body);
    if (validateBody.error) {
      return res.status(400).json({ message: validateBody.error.message });
    }

    const reservation = await Reservations.findOne({
      where: { id: reservationId },
    });
    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const getUserForEmail = await User.findOne({
      where: { id: reservation?.user_id },
    });

    if (newStatus === "Confirmed") {
      sendEmail(
        getUserForEmail?.email,
        getUserForEmail?.name,
        createTableConfirmedText(getUserForEmail.name, reservation)
      );
    }

    if (newStatus === "Cancelled") {
      sendEmail(
        getUserForEmail?.email,
        getUserForEmail?.name,
        createCancelledTableText(getUserForEmail.name, reservation)
      );
    }

    reservation.status = newStatus;

    await reservation.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", reservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update reservation status" });
  }
};

const getTodayReservations = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const reservations = await Reservations.findAll({
      where: {
        start_time: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    if (!reservations.length) {
      return res
        .status(404)
        .json({ message: "No reservations found for today" });
    }

    return res.status(200).json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving today's reservations" });
  }
};

module.exports = {
  addNewReservation,
  getReservationByIdWithUser,
  getAllReservationsWithUser,
  getAllUsersReservations,
  changeReservationStatus,
  getTodayReservations,
};
