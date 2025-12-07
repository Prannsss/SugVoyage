import express from "express";
import userController from "../../controller/Authentication/userAuth.js";

const userAuthRouter = express.Router();

// Register route
userAuthRouter.post("/register", userController.register);

// Login route
userAuthRouter.post("/login", userController.login);

export default userAuthRouter;
