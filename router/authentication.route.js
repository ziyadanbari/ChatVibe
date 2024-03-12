import { Hono } from "hono";
import { googleAuth } from "../controllers/auth/google.auth.js";
import { googleCallbackHandler } from "../controllers/auth/google.callback.auth.js";
import { register } from "../controllers/auth/register.js";
import { login } from "../controllers/auth/login.js";

const auth = new Hono({});

auth.get("/google", googleAuth);
auth.post("/google/callback", googleCallbackHandler);
auth.post("/register", register);
auth.post("/login", login);
export { auth };
