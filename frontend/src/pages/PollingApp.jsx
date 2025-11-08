import React from "react";
import { AuthProvider } from "../context/AuthContext";
import AuthPage from "../components/AuthPage";
import MainApp from "../components/MainApp";
import { useAuth } from "../context/AuthContext";

function InnerApp() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!user ? <AuthPage /> : <MainApp />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  );
}
