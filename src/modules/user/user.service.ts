import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async() => {
  
}

export const userServices = {
  getUser,
  getSingleUser,
};
