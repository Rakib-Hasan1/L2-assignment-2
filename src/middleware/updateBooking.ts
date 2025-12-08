import { Request, Response } from "express";
import { pool } from "../config/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const updateBooking = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, config.jwtsecret!) as JwtPayload;
    const { bookingId } = req.params;
    const { status } = req.body;

    const bookingResult = await pool.query(
      `SELECT * FROM bookings WHERE id=$1`,
      [bookingId]
    );
    if (bookingResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const booking = bookingResult.rows[0];

    if (decoded.role === "customer" && status === "cancelled") {
      await pool.query(`UPDATE bookings SET status='cancelled' WHERE id=$1`, [
        bookingId,
      ]);
      await pool.query(
        `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
        [booking.vehicle_id]
      );

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: {
          id: booking.id,
          customer_id: booking.customer_id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
          rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
          total_price: Number(booking.total_price),
          status: "cancelled",
        },
      });
    }

    if (decoded.role === "admin" && status === "returned") {
      await pool.query(`UPDATE bookings SET status='returned' WHERE id=$1`, [
        bookingId,
      ]);
      await pool.query(
        `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
        [booking.vehicle_id]
      );

      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: {
          id: booking.id,
          customer_id: booking.customer_id,
          vehicle_id: booking.vehicle_id,
          rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
          rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
          total_price: Number(booking.total_price),
          status: "returned",
          vehicle: {
            availability_status: "available",
          },
        },
      });
    }

    return res
      .status(403)
      .json({ success: false, message: "Unauthorized action" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default updateBooking;
