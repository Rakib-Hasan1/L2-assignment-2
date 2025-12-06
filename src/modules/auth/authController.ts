import { Request, Response } from "express";
import { authServices } from "./authService";

const signup = async (req: Request, res: Response) => {
  try {
    const result = await authServices.signup(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Can't inserted Users data!!",
      errors: error.message,
    });
  }
};

const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.signin(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Can't inserted Users data!!",
      errors: error.message,
    });
  }
};

export const authControllers = {
  signup,
  signin,
};
