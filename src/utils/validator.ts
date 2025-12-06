export const validateUserInput = (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone || !role) {
    throw new Error("All fields are required");
  }

  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Optional: regex for phone or role validation
  if (!["admin", "customer"].includes(role as string)) {
    throw new Error("Role must be either 'admin' or 'customer'");
  }

  return payload;
};
