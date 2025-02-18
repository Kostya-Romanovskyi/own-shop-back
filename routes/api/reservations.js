const express = require("express");
const router = express.Router();

const { authorization, upload } = require("../../middleware/index");

const ctrlReservations = require("../../controllers/reservations");

// get all reservations
router.get("/reservation", ctrlReservations.getAllReservationsWithUser);

//get all reservations for today
router.get("/reservation-today", ctrlReservations.getTodayReservations);

// get reservation by id with user
router.get(
  "/reservation/:user_id",
  ctrlReservations.getReservationByIdWithUser
);

// get all user`s reservations
router.get(
  "/reservation-my/:user_id",
  ctrlReservations.getAllUsersReservations
);

// ADD new reservation
router.post("/reservation", ctrlReservations.addNewReservation);

// Change reservation status
router.patch(
  "/reservation-status/:reservationId",
  ctrlReservations.changeReservationStatus
);

// //ADD ingredients to item
// router.post("/items/:id/ingredients", ctrlProdItem.addIngredientsToItem);

// // DELETE request to remove ingredients from a product item
// router.delete("/items/:id/ingredients", ctrlProdItem.removeIngredientsFromItem);

// // UPDATE item
// router.patch("/items/:id", upload.single("image"), ctrlProdItem.updateItem);

// // DELETE item
// router.delete("/items/:id", ctrlProdItem.deleteItem);

module.exports = router;
