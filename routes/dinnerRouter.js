import express from "express";
import {
  getAllDinner,
  createDinner,
  viewDinner,
  updateDinner,
  deleteDinner,
} from "../controller/dinnerController.js";

export const dinnerRouter = express.Router();

dinnerRouter.get("/all-dinner", getAllDinner);
dinnerRouter.post("/new-dinner", createDinner);

dinnerRouter.get("/view-dinner/:id", viewDinner);
dinnerRouter.patch("/update-dinner/:id", updateDinner);
dinnerRouter.delete("/delete-dinner/:id", deleteDinner);
