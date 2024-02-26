import Cookies from "universal-cookie";

export function setCookie(name, value, options) {
  const cookies = new Cookies();
  const maxAge = new Date().setFullYear(new Date().getFullYear() + 40);
  cookies.set(name, value, {
    maxAge,
    path: "/",
    ...options,
  });
  return true;
}
