import { verify } from "hono/jwt";
export async function getIdFromToken(c) {
  try {
    const cookies = c.req.header("Cookie");
    const token = cookies.token || {};
    if (!token) return null;
    const { userId } = (await verify(token, process.env.JWT_SECRET)) || {};
    return userId || null;
  } catch (error) {
    return null;
  }
}
