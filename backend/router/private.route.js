import { Hono } from "hono";
import getUserProfile from "../controllers/private/me.js";
import { checkAuthorization } from "../middlewares/checkAuthorization.js";
import { logout } from "../controllers/private/logout.js";
import { editUser } from "../controllers/private/editUser.js";
import { changePassword } from "../controllers/private/changePassword.js";
import { searchUser } from "../controllers/private/searchUser.js";

const privateRoute = new Hono({});
privateRoute.use("*", checkAuthorization);

privateRoute.get("me", getUserProfile);
privateRoute.get("logout", logout);
privateRoute.get("search/:user", searchUser);
privateRoute.post("edit_user", editUser);
privateRoute.post("change_password", changePassword);

export { privateRoute };
