// Automatically switches between production server and local development
const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api/campaigns"
    : "/api/campaigns";
const campaignForm = document.getElementById("campaignForm");
const campaignTableBody = document.getElementById("campaignTableBody");

// Fetch and display campaigns on load
async function fetchCampaigns() {
  try {
    const response = await fetch(API_URL);
    const campaigns = await response.json();

    campaignTableBody.innerHTML = "";

    if (campaigns.length === 0) {
      campaignTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b; padding: 2rem;">No campaigns found. Create your first one!</td></tr>`;
      return;
    }

    campaigns.forEach((campaign) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${campaign.campaignName}</strong></td>
        <td>${campaign.clientName}</td>
        <td>₹${campaign.budget.toLocaleString("en-IN")}</td>
        <td>
          <span class="badge ${campaign.status}" style="cursor: pointer;" onclick="toggleStatus('${campaign._id}', '${campaign.status}')" title="Click to change status">
            ${campaign.status}
          </span>
        </td>
        <td><button class="delete-btn" onclick="deleteCampaign('${campaign._id}')">Delete</button></td>
      `;
      campaignTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
  }
}

// Function to cycle and update campaign status
async function toggleStatus(id, currentStatus) {
  const statusCycle = {
    Active: "Paused",
    Paused: "Completed",
    Completed: "Active",
  };

  const newStatus = statusCycle[currentStatus] || "Active";

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchCampaigns(); // Refresh table to reflect new status
    } else {
      alert("Failed to update status");
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
}

// Handle form submission to create a campaign
campaignForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const campaignName = document.getElementById("campaignName").value;
  const clientName = document.getElementById("clientName").value;
  const budget = document.getElementById("budget").value;
  const status = document.getElementById("status").value;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignName, clientName, budget, status }),
    });

    if (response.ok) {
      campaignForm.reset();
      fetchCampaigns(); // Refresh table
    } else {
      alert("Failed to create campaign");
    }
  } catch (error) {
    console.error("Error creating campaign:", error);
  }
});

// Delete a campaign by ID
async function deleteCampaign(id) {
  if (!confirm("Are you sure you want to delete this campaign?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchCampaigns(); // Refresh table
    } else {
      alert("Failed to delete campaign");
    }
  } catch (error) {
    console.error("Error deleting campaign:", error);
  }
}

// Initial load
fetchCampaigns();
