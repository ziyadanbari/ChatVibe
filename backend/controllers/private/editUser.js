import { getIdFromToken } from "../../lib/getIdFromToken.js";
import { User } from "../../models/user.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import { put } from "@vercel/blob";
import crypto from "crypto";

const ACCEPTED_FIELDS = ["username", "profile_pic"];

function convertEmptyToNull(fields) {
  const filteredFields = {};
  for (let key in fields) {
    const value = fields[key];
    filteredFields[key] = value || null;
  }
  return filteredFields;
}

export async function editUser(c) {
  try {
    const fields = await c.req.parseBody();
    for (let key in fields) {
      if (!ACCEPTED_FIELDS.includes(key)) {
        delete fields[key];
      }
    }
    let user = c.user;
    if (!user) {
      const userId = await getIdFromToken(c);
      user = await User.findById(userId);
    }
    const filteredFields = convertEmptyToNull(fields);
    if (
      filteredFields.profile_pic &&
      (Buffer.isBuffer(filteredFields.profile_pic) ||
        filteredFields.profile_pic instanceof File)
    ) {
      const bufferFile = await filteredFields.profile_pic.arrayBuffer();
      const blob = await put(
        `${crypto.randomBytes(20).toString("hex")}.png`,
        bufferFile,
        { access: "public" }
      );
      filteredFields.profile_pic = blob.url;
    }
    user.set(filteredFields);
    await user.save();
    return c.json({ message: "Changed" });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
