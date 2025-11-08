import React, { useState } from "react";
import { BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PollsView from "./Polls/PollsView";
import AdminPanel from "./Admin/AdminPanel";

export default function MainApp() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("polls");

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              <h1 className="text-xl font-bold text-gray-900">
                Polling System
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setView("polls")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === "polls"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Polls
              </button>

              {user.role === "admin" && (
                <button
                  onClick={() => setView("admin")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === "admin"
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Admin Panel
                </button>
              )}

              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === "polls" ? <PollsView /> : <AdminPanel />}
      </main>
    </div>
  );
}
