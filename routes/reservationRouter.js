import express from "express";
import {
  getAllReservation,
  createReservation,
  viewReservation,
  updateReservation,
  deleteReservation,
} from "../controller/reservationController.js";

export const reservationRouter = express.Router();

reservationRouter.get("/all-reservation", getAllReservation);
reservationRouter.post("/new-reservation", createReservation);

reservationRouter.get("/view-reservation/:id", viewReservation);
reservationRouter.patch("/update-reservation/:id", updateReservation);
reservationRouter.delete("/delete-Reservation/:id", deleteReservation);
