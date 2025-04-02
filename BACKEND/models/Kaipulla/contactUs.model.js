import mongoose from 'mongoose';
import { Kaipulla } from '../../config/db.js';

const contactSchema = new mongoose.Schema({
  actionType: {
    type: String,
    required: true,
    enum: ['Ask for Call', 'Mail Us', 'Message Us'], // Specific to Contact us actions
  },
  googleId: {
    type: String, // User's Google ID fetched from route parameter
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default Kaipulla.model('Contact', contactSchema, 'Contacts');
