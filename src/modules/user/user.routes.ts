import { userControllers } from './user.controller';
import express from "express";

import auth from "../../middleware/auth";

const router = express.Router();

router.get("/", auth, userControllers.getUser);

router.get("/:id", userControllers.getSingleUser);

export const userRoutes = router;
