// models/Customer/Cart.model.js
import mongoose from 'mongoose';// Adjust path to your db.js
import { Customer} from '../../config/db.js';

const cartSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true, // Fetched from the route parameter
  },
  productName: {
    type: String,
    required: true, // Fetched from the route parameter and validated
  },
  productDescription: {
    type: String,
    required: true, // Fetched from Product model
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Fetched from Product model
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1, // Default to 1 item
  },
}, { timestamps: true });

const cart =Customer.model('Cart', cartSchema, 'Cart');
export default cart;