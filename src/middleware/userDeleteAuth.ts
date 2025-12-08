import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";
import { pool } from "../config/db";

const canDeleteUser = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }

      const decoded = jwt.verify(token, config.jwtsecret!) as JwtPayload;
      req.user = decoded;

      // Only admin can delete
      if (decoded.role !== "admin") {
        return res
          .status(403)
          .json({ success: false, message: "Only admin can delete users" });
      }

      const { userId } = req.params;

      // Check active bookings
      const bookingCheck = await pool.query(
        `SELECT COUNT(*) AS count 
         FROM bookings 
         WHERE id=$1 AND status IN ('available','booked')`,
        [userId]
      );

      if (parseInt(bookingCheck.rows[0].count, 10) > 0) {
        return res.status(409).json({
          success: false,
          message: "User cannot be deleted because they have active bookings",
        });
      }

      next(); // ✅ pass to controller
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

export default canDeleteUser;
