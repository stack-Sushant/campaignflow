const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");

// 1. GET: Fetch all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. POST: Create a new campaign
router.post("/", async (req, res) => {
  const { campaignName, clientName, budget, status } = req.body;

  const newCampaign = new Campaign({
    campaignName,
    clientName,
    budget,
    status,
  });

  try {
    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. DELETE: Delete a campaign by ID
router.delete("/:id", async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// Update campaign status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedCampaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to update status" });
  }
});