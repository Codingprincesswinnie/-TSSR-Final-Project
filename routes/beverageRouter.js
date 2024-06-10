import express from "express";
import {
  getAllBeverage,
  createBeverage,
  viewBeverage,
  updateBeverage,
  deleteBeverage,
} from "../controller/beverageController.js";

export const beverageRouter = express.Router();

beverageRouter.get("/all-menu-beverage", getAllBeverage);
beverageRouter.post("/new-menu-beverage", createBeverage);

beverageRouter.get("/view-one-menu-beverage/:id", viewBeverage);
beverageRouter.patch("/update-menu-beverage/:id", updateBeverage);
beverageRouter.delete("/delete-menu-beverage/:id", deleteBeverage);
