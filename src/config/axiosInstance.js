import axios from "axios";
import { baseURLApi } from "./api.js";

export const axiosInstance = axios.create({
  baseURL: baseURLApi,
  withCredentials: true,
});
