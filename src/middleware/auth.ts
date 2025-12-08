import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = () => {
  return async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new Error("Your are not authorized");
      }
      const decoded = jwt.verify(token, config.jwtsecret!) as JwtPayload;

      const user = await pool.query(`SELECT * FROM users WHERE id=$1`, [
        req.body.customer_id,
      ]);

      const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
        req.body.vehicle_id,
      ]);

      if (decoded.id !== user.rows[0].id) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      } else {
        if (req.body.vehicle_id !== vehicle.rows[0].id) {
          res.status(404).json({
            success: false,
            message: "Vehicle not found",
          });
        } else {
          const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
            req.body;
          const { id, availability_status, vehicle_name, daily_rent_price } =
            vehicle.rows[0];
          const start = new Date(rent_start_date);
          const end = new Date(rent_end_date);
          const diffInMs = end.getTime() - start.getTime();
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
          const total_price = diffInDays * vehicle.rows[0].daily_rent_price;

          const createBooking = await pool.query(
            `
            INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
            `,
            [
              customer_id,
              vehicle_id,
              rent_start_date,
              rent_end_date,
              total_price,
              "active",
            ]
          );

          await pool.query(
            `UPDATE vehicles SET availability_status = 'booked' WHERE id=$1`,
            [id]
          );

          res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: {
              id: createBooking.rows[0].id,
              customer_id: createBooking.rows[0].customer_id,
              vehicle_id: createBooking.rows[0].vehicle_id,
              rent_start_date: createBooking.rows[0].rent_start_date
                .toISOString()
                .split("T")[0],
              rent_end_date: createBooking.rows[0].rent_end_date
                .toISOString()
                .split("T")[0],
              total_price: Number(createBooking.rows[0].total_price),
              status: createBooking.rows[0].status,
              vehicle: {
                vehicle_name,
                daily_rent_price,
              },
            },
          });
        }
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Internal server error. Can't create booking!!",
        error: error.message,
      });
    }
  };
};

export default auth;
