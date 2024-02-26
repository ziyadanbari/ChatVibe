import { sign } from "hono/jwt";

export async function assignNewAccessToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expirationDate = new Date().setFullYear(new Date().getFullYear() + 20);
  const token = await sign({ ...payload, exp: expirationDate }, secret);
  return { token, expirationDate };
}
