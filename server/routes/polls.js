const express = require("express");
const Poll = require("../models/Poll");
const Vote = require("../models/Vote");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// helper: determine if poll is closed (either manual flag or closeAt in the past)
function isPollClosed(poll) {
  if (!poll) return false;
  if (poll.isClosed) return true;
  if (poll.closeAt && new Date() >= new Date(poll.closeAt)) return true;
  return false;
}

/* -------------------------
   ADMIN: CREATE POLL
-------------------------- */
router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { question, options, closeAt } = req.body;

    if (!question)
      return res.status(400).json({ message: "Question required" });
    if (!options || !Array.isArray(options))
      return res.status(400).json({ message: "Options must be an array" });

    // sanitize options: trim, remove empties and duplicates
    const cleaned = options
      .map((o) => (typeof o === "string" ? o.trim() : ""))
      .filter((o) => o.length > 0);

    const unique = Array.from(new Set(cleaned));
    if (unique.length < 2)
      return res
        .status(400)
        .json({ message: "At least 2 unique, non-empty options required" });

    // optional closeAt validation
    let closeDate = null;
    if (closeAt) {
      closeDate = new Date(closeAt);
      if (isNaN(closeDate.getTime()))
        return res.status(400).json({ message: "Invalid closeAt date" });
      if (closeDate <= new Date())
        return res
          .status(400)
          .json({ message: "closeAt must be a future date/time" });
    }

    const poll = await Poll.create({
      question,
      options: unique,
      closeAt: closeDate,
      createdBy: req.user._id,
    });

    res.status(201).json({ poll });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------
   USER: VOTE (ONCE)
-------------------------- */
router.post(
  "/:pollId/vote",
  requireAuth,
  requireRole("user", "admin"),
  async (req, res) => {
    try {
      const { pollId } = req.params;
      const { optionIndex } = req.body;

      const poll = await Poll.findById(pollId);
      if (!poll) return res.status(404).json({ message: "Poll not found" });
      if (isPollClosed(poll))
        return res.status(400).json({ message: "Poll is closed" });

      // Validate option
      if (optionIndex < 0 || optionIndex >= poll.options.length)
        return res.status(400).json({ message: "Invalid option index" });

      // Prevent voting twice
      const existingVote = await Vote.findOne({ pollId, userId: req.user._id });
      if (existingVote)
        return res
          .status(409)
          .json({ message: "You already voted on this poll" });

      await Vote.create({
        pollId,
        userId: req.user._id,
        optionIndex,
      });

      res.json({ message: "Vote recorded" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------------------------
   ADMIN: CLOSE POLL
-------------------------- */
router.patch(
  "/:pollId/close",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const poll = await Poll.findByIdAndUpdate(
        req.params.pollId,
        { isClosed: true },
        { new: true }
      );

      if (!poll) return res.status(404).json({ message: "Poll not found" });

      res.json({ poll });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Re-open a poll (admin)
router.patch(
  "/:pollId/open",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const poll = await Poll.findByIdAndUpdate(
        req.params.pollId,
        { isClosed: false },
        { new: true }
      );

      if (!poll) return res.status(404).json({ message: "Poll not found" });

      res.json({ poll });
    } catch (e) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Admin: edit poll
router.put("/:pollId", requireAuth, requireRole("admin"), async (req, res) => {
  try {
    const { question, options, closeAt } = req.body;
    const updates = {};

    if (question) updates.question = question;

    if (options) {
      if (!Array.isArray(options))
        return res.status(400).json({ message: "Options must be an array" });
      const cleaned = options
        .map((o) => (typeof o === "string" ? o.trim() : ""))
        .filter((o) => o.length > 0);
      const unique = Array.from(new Set(cleaned));
      if (unique.length < 2)
        return res
          .status(400)
          .json({ message: "At least 2 unique, non-empty options required" });
      updates.options = unique;
    }

    if (closeAt !== undefined) {
      if (closeAt === null || closeAt === "") {
        updates.closeAt = null;
      } else {
        const closeDate = new Date(closeAt);
        if (isNaN(closeDate.getTime()))
          return res.status(400).json({ message: "Invalid closeAt date" });
        updates.closeAt = closeDate;
      }
    }

    const poll = await Poll.findByIdAndUpdate(req.params.pollId, updates, {
      new: true,
    });
    if (!poll) return res.status(404).json({ message: "Poll not found" });
    res.json({ poll });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin: delete poll
router.delete(
  "/:pollId",
  requireAuth,
  requireRole("admin"),
  async (req, res) => {
    try {
      const poll = await Poll.findByIdAndDelete(req.params.pollId);
      if (!poll) return res.status(404).json({ message: "Poll not found" });
      // optionally remove votes
      await Vote.deleteMany({ pollId: poll._id });
      res.json({ message: "Poll deleted" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------------------------
   PUBLIC: VIEW RESULTS (ONLY AFTER CLOSED)
-------------------------- */
router.get("/:pollId/results", requireAuth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (!isPollClosed(poll))
      return res.status(403).json({ message: "Poll not closed yet." });

    // Only allow results for users who voted or admins
    const existingVote = await Vote.findOne({
      pollId: poll._id,
      userId: req.user._id,
    });
    if (req.user.role !== "admin" && !existingVote) {
      return res
        .status(403)
        .json({ message: "Results visible only to users who voted" });
    }

    // Count votes
    const votes = await Vote.find({ pollId: poll._id });

    const results = poll.options.map((opt, index) => ({
      option: opt,
      votes: votes.filter((v) => v.optionIndex === index).length,
    }));

    res.json({
      question: poll.question,
      options: poll.options,
      results,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

/* -------------------------
   GET ALL POLLS (ANY USER)
-------------------------- */
router.get("/", requireAuth, async (req, res) => {
  try {
    // Admins see all polls; normal users see only open polls
    let polls = [];
    if (req.user.role === "admin") {
      polls = await Poll.find().sort({ createdAt: -1 });
      return res.json(polls);
    }

    // for users: find polls that are not closed (isClosed=false and closeAt in future or null)
    const now = new Date();
    polls = await Poll.find({
      $or: [{ isClosed: false }, { closeAt: { $gt: now } }, { closeAt: null }],
    }).sort({ createdAt: -1 });

    // compute whether the requesting user already voted on each poll
    const pollIds = polls.map((p) => p._id);
    const votes = await Vote.find({
      pollId: { $in: pollIds },
      userId: req.user._id,
    });
    const votedSet = new Set(votes.map((v) => String(v.pollId)));

    const response = polls.map((p) => ({
      _id: p._id,
      question: p.question,
      options: p.options,
      createdBy: p.createdBy,
      createdAt: p.createdAt,
      closeAt: p.closeAt,
      isClosed: isPollClosed(p),
      hasVoted: votedSet.has(String(p._id)),
    }));

    res.json(response);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
