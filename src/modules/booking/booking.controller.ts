import { Request, Response } from "express";
import { bookingServices } from "./booking.service";

const getBookings = async (req: Request, res: Response) => {
  const result = await bookingServices.getBooking();

  const formatted = result.rows.map((row) => ({
    id: row.id,
    customer_id: row.customer_id,
    vehicle_id: row.vehicle_id,
    rent_start_date: row.rent_start_date.toISOString().split("T")[0],
    rent_end_date: row.rent_end_date.toISOString().split("T")[0],
    total_price: Number(row.total_price),
    status: row.status,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
    },
    vehicle: {
      vehicle_name: row.vehicle_name,
      registration_number: row.registration_number,
    },
  }));

  res.status(200).json({
    success: true,
    message: "Bookings retrieved successfully",
    data: formatted,
  });
};

export const bookingControllers = {
  getBookings,
};
