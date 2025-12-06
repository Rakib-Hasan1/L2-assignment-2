import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL CHECK (char_length(password) >= 6),
        phone INT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'customer'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name TEXT NOT NULL,
        type TEXT NOT NULL, -- e.g. car, bike, truck
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS Bookings (
        id SERIAL PRIMARY KEY,
        customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
        status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
        CONSTRAINT rent_dates_check CHECK (rent_end_date > rent_start_date)
        );
        `);
};

initDB();

// parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is Root Api",
    path: req.path,
  });
});

app.post("/users", (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    success: true,
    message: "Users retrived successfully",
    data: req.body,
  });
});

app.listen(5000, () => {
  console.log(`Server on running on port: ${port}`);
});
