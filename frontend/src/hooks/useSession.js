import { fetchSession } from "@/lib/fetchSession.js";
import { DataContext } from "@/providers/DataProvider.jsx";
import { useContext } from "react";

export default function useSession() {
  const { session, setSession } = useContext(DataContext).session;
  async function refreshSession() {
    return fetchSession().then((res) => setSession(res.data));
  }
  return { session, setSession, refreshSession };
}
