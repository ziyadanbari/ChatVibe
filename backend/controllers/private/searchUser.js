import { secureUserPopulate } from "../../constants/index.js";
import { User } from "../../models/user.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";

export async function searchUser(c) {
  try {
    const userSearched = c.req.param("user");
    const user = c.user;
    const escapedUserSearched = userSearched.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regexPattern = [...escapedUserSearched]
      .map((char) => `(?=.*${char})`)
      .join("");
    const result = await User.find({
      username: { $regex: new RegExp(`^${regexPattern}`, "ig") },
    }).select(secureUserPopulate);
    const filteredResult = result.filter(
      ({ _id }) => _id.toString() !== user._id.toString()
    );
    return c.json({ users: filteredResult });
  } catch (error) {
    return apiErrorHandler(c, error);
  }
}
