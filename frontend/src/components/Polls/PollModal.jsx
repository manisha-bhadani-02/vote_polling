import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_BASE } from "../../services/api";

export default function PollModal({ poll, onClose, onRefresh }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { token } = useAuth();

  const isPollClosed =
    poll.isClosed || (poll.closeAt && new Date(poll.closeAt) <= new Date());

  useEffect(() => {
    if (isPollClosed || poll.hasVoted) {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE}/polls/${poll._id}/results`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setResults(data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/polls/${poll._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ optionIndex: selectedOption }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to vote");
      }

      setSuccess("Vote recorded successfully!");
      setTimeout(() => {
        onRefresh();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalVotes = results?.results.reduce((sum, r) => sum + r.votes, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{poll.question}</h2>
          {isPollClosed && (
            <div className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded inline-block">
              Poll Closed
            </div>
          )}
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {results ? (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">
                Results ({totalVotes} votes)
              </h3>
              {results.results.map((result, idx) => {
                const percentage =
                  totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        {result.option}
                      </span>
                      <span className="text-gray-600">
                        {result.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-indigo-600 h-3 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {poll.options.map((option, idx) => (
                <label
                  key={idx}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedOption === idx
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="poll-option"
                    checked={selectedOption === idx}
                    onChange={() => setSelectedOption(idx)}
                    className="mr-3"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          {!results && !isPollClosed && (
            <button
              onClick={handleVote}
              disabled={selectedOption === null || loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Vote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
