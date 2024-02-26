import z from "zod";
export const registerSchema = z.object({
  username: z.string({ required_error: "Username missed" }).min(1),
  password: z
    .string({ required_error: "Password missed" })
    .min(8, "Password must be at least 8 characters"),
  avatar: z.any().optional(),
});

export const loginSchema = z.object({
  username: z.string({ required_error: "Username missed" }).min(1),
  password: z.string({ required_error: "Password missed" }).min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z
    .string({ required_error: "Current password missed" })
    .min(1, { message: "Current password missed" }),
  newPassword: z
    .string({ required_error: "New password missed" })
    .min(1, { message: "Current password missed" }),
});
