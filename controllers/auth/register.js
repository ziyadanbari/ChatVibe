import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { put } from "@vercel/blob";
import crypto from "crypto";
import { registerSchema } from "../../schemas/index.js";
import { isUserExist } from "../../utils/isUserExist.js";
import { User } from "../../models/user.js";
import { assignNewAccessToken } from "../../utils/assignAccessToken.js";
import { serialize } from "cookie";
import { errorResponse } from "../../constants/index.js";
import { validateImage } from "../../utils/validateImage.cjs";

export async function register(c) {
  try {
    const body = await c.req.parseBody();
    const avatar = body.avatar;

    // Validate form data
    const isFormValid = registerSchema.safeParse(body);
    if (!isFormValid.success) throw [400, isFormValid.error.errors[0].message];

    // Check if user already exists
    const isExist = await isUserExist({ username: body.username });
    if (isExist) throw errorResponse.Used;

    let profile_pic;
    // Upload avatar if provided
    console.log(avatar);
    if (avatar && Buffer.isBuffer(avatar)) {
      const isImage = await validateImage(avatar);
      if (!isImage) throw [400, "You can only upload an image"];
      const blob = await put(
        `${crypto.randomBytes(20).toString("hex")}.png`,
        avatar,
        { access: "public" }
      );
      profile_pic = blob.url;
    }

    // Create new user
    const newUser = new User({
      ...body,
      profile_pic,
    });
    await newUser.save({ hashPassword: true });

    // Assign new access token
    const { token, expirationDate } = await assignNewAccessToken({
      userId: newUser._id.toString(),
    });

    // Return response with cookie
    return c.json({ message: `Welcome ${newUser.username}` }, 201, {
      "Set-Cookie": serialize("token", token, {
        maxAge: expirationDate,
        path: "/",
        httpOnly: false,
        sameSite: "none",
        secure: true,
      }),
    });
  } catch (error) {
    // Handle errors
    return apiErrorHandler(c, error);
  }
}
