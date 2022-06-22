import express from "express";
const usersRouter = express.Router();

// Load Controllers
import { getUser, updateUser } from "../controllers/users";

// Load Auth Middleware
import isAuthenticated from "../middleware/auth";

usersRouter.route("/").all(isAuthenticated).get(getUser).put(updateUser);

export default usersRouter;