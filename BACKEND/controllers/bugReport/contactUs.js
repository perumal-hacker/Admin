import Contact from '../../models/Kaipulla/contactUs.model.js';
// Create a new contact request
const createContact = async (req, res) => {
  try {
    const { actionType } = req.body;
    const googleId = req.params.googleId; // Fetch googleId from route parameter

    // Validate required fields
    if (!actionType || !googleId) {
      return res.status(400).json({ message: 'actionType and googleId are required' });
    }

    // Create contact data
    const contactData = {
      actionType,
      googleId,
    };

    const newContact = new Contact(contactData);
    await newContact.save();

    return res.status(201).json({ message: 'Contact request submitted successfully', contact: newContact });
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default createContact;