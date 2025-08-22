// Central route configuration for the app
// - Public: Landing, Focus Timer
// - Guest-only: Login, Register (blocked if already authenticated)
// - Private: User, Tasks, Journal (wrapped by RequireAuth)
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserPage from "../pages/UserPage";
import TasksPage from "../pages/TasksPage";
import JournalPage from "../pages/JournalPage";
import WorkoutsPage from "../pages/WorkoutsPage";
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
          { path: "workouts", element: <WorkoutsPage /> },
        ],
      },
      { path: "focus-timer", element: <FocusTimerPage /> },
    ],
  },
]);

export default AppRouter;
