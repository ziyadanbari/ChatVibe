import { errorResponse } from "../../constants/index.js";
import { getIdFromToken } from "../../lib/getIdFromToken.js";
import { User } from "../../models/user.js";
import { changePasswordSchema } from "../../schemas/index.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";

export async function changePassword(c) {
  try {
    const body = await c.req.json();
    const isFormValid = changePasswordSchema.safeParse(body);
    if (!isFormValid.success) throw [400, isFormValid.error.errors[0]];
    const { currentPassword, newPassword } = body;
    let user = c.user;
    if (!user) {
      const { userId } = await getIdFromToken(c);
      user = await User.findById(userId);
    }
    if (user.provider !== "email") return;
    const isPasswordMatched = await user.matchPassword(currentPassword);
    if (!isPasswordMatched) throw [401, "Password incorrect"];
    user.password = newPassword;
    await user.save({ hashPassword: true });
    return c.json({ message: "Password changed" });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
