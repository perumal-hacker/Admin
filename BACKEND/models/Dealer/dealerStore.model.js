import mongoose from 'mongoose';
import { Dealer } from '../../config/db.js';

const dealerSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  category: { type: String },
  location: {
    city: String,
    state: String,
    street: String
  },
  phoneNumber: {
    countryCode: String,
    number: String
  }
});
// Use the "storeDetails" collection in the "Dealers" database
const StoreDetails = Dealer.model("StoreDetails", dealerSchema, "StoreDetails");

export default StoreDetails;
