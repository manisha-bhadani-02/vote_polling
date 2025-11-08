import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../services/api";
import PollCard from "./PollCard";
import PollModal from "./PollModal";

export default function PollsView() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null);
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

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600">Loading polls...</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Available Polls</h2>
        <p className="text-gray-600 mt-1">
          Vote on active polls and view results
        </p>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No polls available at the moment</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map((poll) => (
            <PollCard
              key={poll._id}
              poll={poll}
              onSelect={() => setSelectedPoll(poll)}
              onRefresh={fetchPolls}
            />
          ))}
        </div>
      )}

      {selectedPoll && (
        <PollModal
          poll={selectedPoll}
          onClose={() => setSelectedPoll(null)}
          onRefresh={fetchPolls}
        />
      )}
    </div>
  );
}
