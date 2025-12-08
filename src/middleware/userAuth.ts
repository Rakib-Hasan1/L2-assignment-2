import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const canUpdateUser = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, config.jwtsecret!) as JwtPayload;
      req.user = decoded;

      const targetUserId = Number(req.params.userId);

      if (decoded.role === "admin") {
        return next();
      }

      if (decoded.role === "customer") {
        if (decoded.id !== targetUserId) {
          return res.status(403).json({
            success: false,
            message: "You cannot update other users",
          });
        }

        if (req.body.role) {
          return res.status(403).json({
            success: false,
            message: "You cannot change your role",
          });
        }

        return next();
      }

      return res.status(403).json({ message: "Unauthorized role" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};

export default canUpdateUser;
