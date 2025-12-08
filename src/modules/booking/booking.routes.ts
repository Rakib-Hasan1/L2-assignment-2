import { Router } from "express";
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";
import canGetBookings from "../../middleware/bookingAuth";
import updateBooking from "../../middleware/updateBooking";

const router = Router();

router.post("/", auth());

router.get("/", canGetBookings(), bookingControllers.getBookings);

router.put("/:bookingId", updateBooking);

export const bookingRoutes = router;
