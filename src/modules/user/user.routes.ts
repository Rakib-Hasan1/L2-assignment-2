import adminOnly from "../../middleware/adminAuth";
import canUpdateUser from "../../middleware/userAuth";
import canDeleteUser from "../../middleware/userDeleteAuth";
import { userControllers } from "./user.controller";
import express from "express";

const router = express.Router();

router.get("/", adminOnly(), userControllers.getUser);

router.get("/:id", userControllers.getSingleUser);

router.put("/:userId", canUpdateUser(), userControllers.updateUser);

router.delete("/:userId", canDeleteUser(), userControllers.deleteUser);

export const userRoutes = router;
