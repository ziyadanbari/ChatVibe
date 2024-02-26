import { Route, Routes, Navigate } from "react-router";
import Main from "./pages/main/page.jsx";
import Register from "./pages/register/page.jsx";
import Login from "./pages/login/page.jsx";
import CheckAuthorization from "./middlewares/CheckAuthorization.jsx";
import Profile from "./pages/profile/page.jsx";
import GoogleCallback from "./pages/googleCallback/page.jsx";
import { io } from "socket.io-client";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const socket = io("http://127.0.0.1:8000", {
      extraHeaders: {
        auth: document.cookie,
      },
    });
    const handleResponse = (data) => {
      console.log(data);
    };
    const handleError = (data) => {
      console.log(data);
    };
    socket.emit("friend_request", { user: "ziyad anbari" });
    socket.on("response", handleResponse);
    socket.on("error", handleError);
    return () => {
      socket.off("response", handleResponse);
      socket.off("error", handleError);
    };
  }, []);
  return (
    <div className="h-full w-full">
      <Routes>
        <Route element={<CheckAuthorization requiredAuth />}>
          <Route path="/" element={<Main />}>
            <Route index element={<Navigate to={"/profile"} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to={"/"} />} />
          </Route>
        </Route>
        <Route element={<CheckAuthorization requiredAuth={false} to="/" />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
