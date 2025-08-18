import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserPage from "../pages/UserPage";
import TasksPage from "../pages/TasksPage";
import JournalPage from "../pages/JournalPage";
import AppLayout from "../layouts/AppLayout";
import FocusTimerPage from "../features/focus-timer/components/FocusTimerPage";
import { RequireAuth, RequireGuest } from "./guards";

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      {
        element: <RequireGuest />,
        children: [
          { path: "auth/login", element: <LoginPage /> },
          { path: "auth/register", element: <RegisterPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: "user", element: <UserPage /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "journal", element: <JournalPage /> },
        ],
      },
      { path: "focus-timer", element: <FocusTimerPage /> },
    ],
  },
]);

export default AppRouter;
