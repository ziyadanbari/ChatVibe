import { toast } from "react-toastify";

export function toasty(type, message, options) {
  if (message instanceof Error)
    message = message?.response?.data?.message || message.message;
  toast[type](message, {
    autoClose: 3000,
    hideProgressBar: true,
    theme: "dark",
    ...options,
  });
}
