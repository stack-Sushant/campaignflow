const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/campaigns", require("./routes/campaignRoutes"));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all route using regex matching (compatible with newer Express/path-to-regexp)
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Connect to MongoDB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });
// Function to update campaign status
async function toggleStatus(id, currentStatus) {
  // Cycle statuses: Active -> Paused -> Completed -> Active
  const statusCycle = {
    'Active': 'Paused',
    'Paused': 'Completed',
    'Completed': 'Active'
  };
  
  const newStatus = statusCycle[currentStatus] || 'Active';

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      fetchCampaigns(); // Refresh list to display updated status UI
    } else {
      console.error('Failed to update status');
    }
  } catch (error) {
    console.error('Error updating status:', error);
  }
}