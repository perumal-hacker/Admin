import Feedback from "../../models/Kaipulla/feedback.model.js"

// Create a new feedback submission
const createFeedback = async (req, res) => {
  try {
    const { feedbackText } = req.body;
  
    if (!feedbackText ) {
      return res.status(400).json({ message: 'feedbackText and googleId are required' });
    }

    // Create feedback data
    const feedbackData = {
      feedbackText,
   
    };

    const newFeedback = new Feedback(feedbackData);
    await newFeedback.save();

    return res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
  } catch (error) {
    console.error('Create feedback error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default createFeedback;