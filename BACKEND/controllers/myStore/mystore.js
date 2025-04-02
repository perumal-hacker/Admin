import StoreDetails from "../../models/Dealer/dealerStore.model.js"; // Ensure correct path

export const getDealerByGoogleId = async (req, res) => {
  try {
    const { googleId } = req.params;

    if (!googleId) {
      return res.status(400).json({ error: "Google ID is required" });
    }

    const trimmedGoogleId = googleId.trim();

    // Search in storeDetails collection instead of dealers
    const store = await StoreDetails.findOne({
      googleId: { $regex: new RegExp(`^${trimmedGoogleId}$`, "i") }
    }).lean();

    if (!store) {
      return res.status(404).json({ error: "Store not found for this Google ID" });
    }

    res.status(200).json(store);
  } catch (error) {
    console.error("❌ Error fetching store details:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

export const updateStoreDetails = async (req, res) => {
  try {
    const { googleId } = req.params; // Get store by Google ID
    const updateData = req.body; // Data to update

    if (!googleId) {
      return res.status(400).json({ message: "Google ID is required" });
    }

    const updatedStore = await StoreDetails.findOneAndUpdate(
      { googleId }, // Find store by Google ID
      { $set: updateData }, // Update with new data
      { new: true, runValidators: true } // Return updated doc
    );

    if (!updatedStore) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.status(200).json({ message: "Store details updated successfully", updatedStore });
  } catch (error) {
    res.status(500).json({ message: "Error updating store details", error: error.message });
  }
};
