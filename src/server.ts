import express, { Request, Response } from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/authRoutes";

const app = express();
const port = config.port;

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

app.listen(5000, () => {
  console.log(`Server on running on port: ${port}`);
});
