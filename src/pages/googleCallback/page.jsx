import { googleCallback } from "@/config/api.js";
import { axiosInstance } from "@/config/axiosInstance.js";
import useSession from "@/hooks/useSession.js";
import { toasty } from "@/lib/toasty.js";
import React, { useLayoutEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function GoogleCallback() {
  let [searchParams, setSearchParams] = useSearchParams();
  const { refreshSession } = useSession();
  const code = searchParams.get("code");
  useLayoutEffect(() => {
    async function exchangeCode() {
      try {
        const response = await axiosInstance.post(googleCallback, { code });
        localStorage.setItem("token", response?.data?.token);
        toasty("success", response.data.message);
        await refreshSession();
      } catch (error) {
        toasty("error", error);
      } finally {
        location.href = "/";
      }
    }
    if (!code) return;
    exchangeCode();
  }, [code, searchParams]);
}
