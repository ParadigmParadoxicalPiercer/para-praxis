import React from "react";
import { Routes, Route } from "react-router";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import FocusTimerPage from "./features/focus-timer/components/FocusTimerPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="user" element={<UserPage />} />
        <Route path="focus-timer" element={<FocusTimerPage />} />
      </Route>
    </Routes>
  );
}
