import React, { useEffect, useState } from "react";
import { Plus, Trash2, Lock, Unlock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../services/api";
import CreatePollModal from "./CreatePollModal";

export default function AdminPanel() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { token } = useAuth();

  const fetchPolls = async () => {
    try {
      const response = await fetch(`${API_BASE}/polls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPolls(data);
    } catch (err) {
      console.error("Error fetching polls:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleStatus = async (pollId, isClosed) => {
    try {
      const endpoint = isClosed ? "open" : "close";
      await fetch(`${API_BASE}/polls/${pollId}/${endpoint}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls();
    } catch (err) {
      console.error("Error toggling poll status:", err);
    }
  };

  const handleDelete = async (pollId) => {
    if (!confirm("Are you sure you want to delete this poll?")) return;

    try {
      await fetch(`${API_BASE}/polls/${pollId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPolls();
    } catch (err) {
      console.error("Error deleting poll:", err);
    }
  };

  if (loading)
    return <div className="text-center py-12 text-gray-600">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-gray-600 mt-1">Manage all polls</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Poll
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Question
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Options
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {polls.map((poll) => {
              const isPollClosed =
                poll.isClosed ||
                (poll.closeAt && new Date(poll.closeAt) <= new Date());
              return (
                <tr key={poll._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {poll.question}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {poll.options.length} options
                  </td>
                  <td className="px-6 py-4">
                    {isPollClosed ? (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Closed
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleToggleStatus(poll._id, isPollClosed)
                        }
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        title={isPollClosed ? "Reopen" : "Close"}
                      >
                        {isPollClosed ? (
                          <Unlock className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(poll._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showCreateForm && (
        <CreatePollModal
          onClose={() => setShowCreateForm(false)}
          onRefresh={fetchPolls}
        />
      )}
    </div>
  );
}
