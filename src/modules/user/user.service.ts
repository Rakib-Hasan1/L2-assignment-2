import { pool } from "../../config/db";

const getUser = async () => {
  const result = await pool.query(`SELECT id, name, email, phone, role FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  const keys = Object.keys(payload);
  const setParams = keys.map((key, index) => `${key}=$${index + 1}`).join(", ");
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new Error("No fields provided to update");
  }

  const result = await pool.query(
    `
    UPDATE users SET ${setParams} WHERE id=$${keys.length + 1} RETURNING *
    `,
    [...values, id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  console.log();
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
