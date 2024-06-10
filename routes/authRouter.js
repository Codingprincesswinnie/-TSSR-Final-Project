import express from 'express';
import {
  createAdminUser,
  loginUser,
  registerUser,
  protect,
  getThisUser,
} from "../controller/authController.js";

export const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);


// admin router
authRouter.post('/create-user', createAdminUser);//create user//

// any thing after this line is protected//
authRouter.use( protect )
authRouter.get("/my-profile", getThisUser);



