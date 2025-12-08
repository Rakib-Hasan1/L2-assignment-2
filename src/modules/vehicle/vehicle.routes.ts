import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import adminOnly from "../../middleware/adminAuth";
import canDeleteVehicle from "../../middleware/canDeleteVehicle";

const router = Router();

router.post("/", adminOnly(), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", adminOnly(), vehicleControllers.updateVehicle);

router.delete("/:vehicleId", adminOnly(), canDeleteVehicle(), vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
