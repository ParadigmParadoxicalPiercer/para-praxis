import React from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import LandingPage from "../components/LandingPage";
// Import other pages as needed
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserPage from "../pages/UserPage";
import AppLayout from "../layouts/AppLayout";
import FocusTimerPage from "../features/focus-timer/components/FocusTimerPage";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "auth/login", element: <LoginPage /> },
      { path: "auth/register", element: <RegisterPage /> },
      { path: "user", element: <UserPage /> },
      { path: "focus-timer", element: <FocusTimerPage /> },
      // Add more routes as needed
    ],
  },
]);

export default AppRouter;
