import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import config from "../config";

const adminOnly = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(500).json({
          message: "You are not allowed",
        });
      }
      const decoded = jwt.verify(
        token,
        config.jwtsecret as string
      ) as JwtPayload;
      req.user = decoded;
      if (!decoded || decoded.role !== "admin") {
        res.status(500).json({
          success: false,
          message: "You are not allowed",
          error: "unauthorized!!",
        });
      }
      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default adminOnly;
