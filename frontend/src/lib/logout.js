import { axiosInstance } from "@/config/axiosInstance.js";
import Cookies from "universal-cookie";
import { logout as logoutApi } from "@/config/api.js";
export async function logout() {
  const cookies = new Cookies();
  try {
    await axiosInstance.get(logoutApi);
  } catch (err) {
  } finally {
    cookies.remove("token");
  }
}
