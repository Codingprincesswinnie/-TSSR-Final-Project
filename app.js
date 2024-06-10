import express from "express";
import morgan from "morgan";
import cors from "cors";

// import {authRouter} from './routes/authRouter.js';
import { beverageRouter } from "./routes/beverageRouter.js";
import { dinnerRouter } from "./routes/dinnerRouter.js";
import { lunchRouter } from "./routes/lunchRouter.js";
import { reservationRouter } from "./routes/reservationRouter.js";
import { authRouter } from "./routes/authRouter.js";

const app = express();
const port = process.env.PORT || 7010;

// CORS configuration//
app.options("*", cors(["http://localhost:4200"]));
app.use(cors(["http://localhost:4200"]));

// JSON body parsing urlencoded//
app.use(express.json({ limit: "5kb" }));
app.use(express.urlencoded({ extended: true, limit: "5kb" }));

if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

//route Specification//
app.use("/api/v1/beverage", beverageRouter);
app.use("/api/v1/dinner", dinnerRouter);
app.use("/api/v1/lunch", lunchRouter);
app.use("/api/v1/reservation", reservationRouter);
 app.use("/api/v1/auth", authRouter);
// app.use('/api/v1/login', authRouter);

app.listen(port, () =>
  console.log(`server running on --- http://localhost:${port}`)
);
