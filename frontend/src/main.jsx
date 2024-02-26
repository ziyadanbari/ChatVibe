import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./global.css";
import { BrowserRouter } from "react-router-dom";
import { DataProvider } from "./providers/DataProvider.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/Loading.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <DataProvider>
      <AuthProvider>
        <Loading />
        <App />
        <ToastContainer />
      </AuthProvider>
    </DataProvider>
  </BrowserRouter>
);
