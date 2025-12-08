import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const canGetBookings = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decoded = jwt.verify(token, config.jwtsecret!) as JwtPayload;
      req.user = decoded;

      if (decoded.role === "admin") {
        return next(); // handled in booking.service.ts
      }

      if (decoded.role === "customer") {
        const bookings = await pool.query(
          `SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date, b.total_price, b.status, v.vehicle_name, v.registration_number, v.type
           FROM bookings b JOIN vehicles v ON b.vehicle_id = v.id
           WHERE b.customer_id = $1`,
          [decoded.id]
        );

        if (bookings.rows.length === 0) {
          return res.status(404).json({
            seccess: false,
            message: "No Bookings exists",
          });
        }

        const formatted = bookings.rows.map((row) => ({
          id: row.id,
          vehicle_id: row.vehicle_id,
          rent_start_date: row.rent_start_date.toISOString().split("T")[0],
          rent_end_date: row.rent_end_date.toISOString().split("T")[0],
          total_price: Number(row.total_price),
          status: row.status,
          vehicle: {
            vehicle_name: row.vehicle_name,
            registration_number: row.registration_number,
            type: row.type,
          },
        }));

        return res.status(200).json({
          success: true,
          message: "Your bookings retrieved successfully",
          data: formatted,
        });
      }

      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

export default canGetBookings;
