import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";

const canDeleteVehicle = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [
      req.params.vehicleId,
    ]);

    if (vehicle.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No vehicle found",
      });
    }
    if (vehicle.rows[0].availability_status === "available") {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Can't delete vehicle. Someone booked it",
      });
    }
  };
};

export default canDeleteVehicle;
