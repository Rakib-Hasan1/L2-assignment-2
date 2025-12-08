import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";
import canGetBookings from "../../middleware/bookingAuth";

const router = Router();

router.post("/", auth());

router.get("/", canGetBookings(), bookingControllers.getBookings);

export const bookingRoutes = router;
