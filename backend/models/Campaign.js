const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  campaignName: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
    default: "Aarav Sharma", // Sample Indian default name
  },
  budget: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending", // Pending, Active, Completed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
