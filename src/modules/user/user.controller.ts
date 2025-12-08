import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();

    res.status(200).json({
      success: true,
      message: "Users data retrived successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Can't get Users data!!",
      errors: error.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getSingleUser(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Get single User data successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Can't get Users data!!",
      errors: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.updateUser(
      req.body,
      req.params.userId as string
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error. Can't update Users data!!",
      errors: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.userId as string);
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userControllers = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
