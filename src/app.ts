import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/authRoutes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";

const app = express();

// intializing DB
initDB();

// parser
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is Root Api",
    path: req.path,
  });
});

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/vehicles", vehicleRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
