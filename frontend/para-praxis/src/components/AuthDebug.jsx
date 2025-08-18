import React from "react";
import { useAuth } from "../auth/AuthProvider";

export default function AuthDebug() {
  const { user, ready } = useAuth();

  return (
    <div className="p-4 bg-gray-100 border rounded text-sm">
      <h3 className="font-bold mb-2">Auth Debug:</h3>
      <p>Ready: {ready ? "✅" : "⏳"}</p>
      <p>User: {user ? `✅ ${user.name || user.email}` : "❌ No user"}</p>
    </div>
  );
}
