import  mongoose  from 'mongoose';
import { Kaipulla } from '../../config/db.js';

const feedbackSchema = new mongoose.Schema({
  feedbackText: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default Kaipulla.model('feedBack', feedbackSchema);