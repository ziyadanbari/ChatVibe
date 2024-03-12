import useSession from "@/hooks/useSession.js";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function CheckAuthorization({ requiredAuth, to = "/login" }) {
  const { session, refreshSession } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(() => {
    if (!session || !Object.keys(session).length)
      refreshSession()
        .then((_) => {
          setIsLoggedIn(true);
        })
        .catch((_) => {
          setIsLoggedIn(false);
        });
    else setIsLoggedIn(true);
  }, [requiredAuth, setIsLoggedIn]);
  if (requiredAuth) {
    if (isLoggedIn === false) return <Navigate to={to} />;
    else if (isLoggedIn === true) return <Outlet />;
  } else {
    if (isLoggedIn === false) return <Outlet />;
    else if (isLoggedIn === true) return <Navigate to={to} />;
  }
}
