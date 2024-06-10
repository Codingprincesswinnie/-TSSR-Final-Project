import express from "express";
import {
  getAllLunch,
  createLunch,
  viewLunch,
  updateLunch,
  deleteLunch,
} from "../controller/lunchController.js";

export const lunchRouter = express.Router();

lunchRouter.get("/all-lunch", getAllLunch);
lunchRouter.post("/new-lunch", createLunch);

lunchRouter.get("/view-lunch/:id", viewLunch);
lunchRouter.patch("/update-lunch/:id", updateLunch);
lunchRouter.delete("/delete-lunch/:id", deleteLunch);
