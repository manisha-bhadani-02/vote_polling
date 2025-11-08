const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  // optional closing date/time; poll is considered closed if isClosed=true OR closeAt <= now
  closeAt: { type: Date },
  isClosed: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Poll", pollSchema);
