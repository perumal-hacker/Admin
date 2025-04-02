import mongoose from 'mongoose';
import { Customer } from '../../config/db.js';

// Shipping schema
const shippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  zip: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String, required: true },
  address: { type: String, required: true },
});

// Regular delivery schema
const regularDeliverySchema = new mongoose.Schema({
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly'],
    required: true,
  },
  days: {
    type: [String],
    default: [],
  },
  dates: {
    type: [Number],
    default: [],
  },
});

// Product schema (minimal version for reference)
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  returnPolicy: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Groceries', 'Books', 'Furniture'],
    default: 'Miscellaneous',
  },
  googleId: { type: String, required: true },
  instock: { type: Number, required: true },
});

// Order schema
const orderSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  productName: { type: String, required: true }, // Now a String
  productDescription: { type: String, required: true },
  returnPolicy: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  deliveryDate: { type: Date, required: true },
  deliveryTime: { type: String, required: true },
  deliveryType: {
    type: String,
    enum: ['One Time Delivery', 'Regular Delivery'],
    required: true,
  },
  regularDeliveryDetails: {
    type: regularDeliverySchema,
    required: function () {
      return this.deliveryType === 'Regular Delivery';
    },
  },
  deliveryMode: { type: String, required: true },
  paymentMode: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment'],
    required: true,
  },
  paymentFile: {
    type: String,
    required: function () {
      return this.paymentMode === 'Online Payment';
    },
  },
  shippingDetails: { type: shippingSchema, required: true },
}, { timestamps: true });

// Register both models with the Customer connection
Customer.model('Products', productSchema);
const Order = Customer.model('Orders', orderSchema);

export default Order;