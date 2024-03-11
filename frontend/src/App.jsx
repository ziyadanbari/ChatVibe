import { Route, Routes, Navigate } from "react-router";
import Main from "./pages/main/page.jsx";
import Register from "./pages/register/page.jsx";
import Login from "./pages/login/page.jsx";
import CheckAuthorization from "./middlewares/CheckAuthorization.jsx";
import Profile from "./pages/profile/page.jsx";
import GoogleCallback from "./pages/googleCallback/page.jsx";
import Conversation from "./pages/conversation/page.jsx";

function App() {
  return (
    <div className="h-full w-full">
      <Routes>
        <Route element={<CheckAuthorization requiredAuth />}>
          <Route path="/" element={<Main />}>
            <Route index element={<Navigate to={"/profile"} />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/conversation/:conversationId"
              element={<Conversation />}
            />
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
