import React from "react";

export default function PollCard({ poll, onSelect }) {
  const isPollClosed =
    poll.isClosed || (poll.closeAt && new Date(poll.closeAt) <= new Date());

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">
          {poll.question}
        </h3>
        {isPollClosed ? (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
            Closed
          </span>
        ) : poll.hasVoted ? (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
            Voted
          </span>
        ) : (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
            Active
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        {poll.options.slice(0, 3).map((option, idx) => (
          <div key={idx} className="text-sm text-gray-600 truncate">
            • {option}
          </div>
        ))}
        {poll.options.length > 3 && (
          <div className="text-sm text-gray-500">
            +{poll.options.length - 3} more options
          </div>
        )}
      </div>

      <button
        onClick={onSelect}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        {isPollClosed
          ? "View Results"
          : poll.hasVoted
          ? "View Details"
          : "Vote Now"}
      </button>
    </div>
  );
}
