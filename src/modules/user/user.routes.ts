import adminOnly from '../../middleware/adminAuth';
import canUpdateUser from '../../middleware/userAuth';
import userAuth from '../../middleware/userAuth';
import { userControllers } from './user.controller';
import express from "express";


const router = express.Router();

router.get("/", adminOnly(), userControllers.getUser);

router.get("/:id", userControllers.getSingleUser);

router.put("/:userId", canUpdateUser(), userControllers.updateUser);

export const userRoutes = router;
