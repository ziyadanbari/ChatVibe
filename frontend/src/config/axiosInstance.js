import axios from "axios";
import { baseURL } from "./api.js";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
