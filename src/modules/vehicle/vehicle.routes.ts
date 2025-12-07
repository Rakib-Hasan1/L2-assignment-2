import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import adminOnly from "../../middleware/adminAuth";

const router = Router();

router.post("/", adminOnly(), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", adminOnly(), vehicleControllers.updateVehicle);

router.delete("/:vehicleId", adminOnly(), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
