import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import AppRouter from "./routes/routes.jsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./auth/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={AppRouter} />
  </AuthProvider>
);
