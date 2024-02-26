import useSession from "@/hooks/useSession.js";
import { fetchSession } from "@/lib/fetchSession.js";
import { useEffect } from "react";

export default function AuthProvider({ children }) {
  const { session, setSession } = useSession();
  useEffect(() => {
    fetchSession()
      .then((response) => {
        setSession(response.data || null);
      })
      .catch((err) => setSession(null));
  }, [setSession]);
  return children;
}
