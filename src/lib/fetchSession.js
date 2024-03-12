import { me } from "@/config/api.js";
import { axiosInstance } from "@/config/axiosInstance.js";

export function fetchSession() {
  return axiosInstance.get(me);
}
