import Product from '../../models/Dealer/product.model.js';
import Cart from '../../models/Customer/cart.model.js';
import Order from '../../models/Customer/order.model.js'; // Import the Order model
import User from '../../models/User/login.model.js';
import mongoose from 'mongoose';

/**
 * Add a product to the cart
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} - JSON response with status and message
 */
const addToCart = async (req, res) => {
  try {
    const { googleId, productName } = req.params; // From route: /:googleId/:productName/cart
    const { quantity, saveAsOrder } = req.body; // Add `saveAsOrder` flag to optionally save as order

    // Validate googleId
    if (!googleId) {
      return res.status(400).json({ message: 'Missing googleId in route' });
    }

    // Validate that the googleId exists in the users collection
    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate productName
    if (!productName) {
      return res.status(400).json({ message: 'Missing productName in route' });
    }

    // Validate quantity
    if (!quantity || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be a positive integer' });
    }

    // Fetch product details from Dealer database using productName
    const product = await Product.findOne({ productName: new RegExp(`^${productName}$`, 'i') }); // Case-insensitive
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the requested quantity exceeds available stock
    if (product.instock < quantity) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }

    // Check if the product is already in the cart for this user
    let cartItem = await Cart.findOne({ googleId, productName });
    if (cartItem) {
      // If the product is already in the cart, update the quantity
      cartItem.quantity += quantity;

      // Check if the updated quantity exceeds available stock
      if (cartItem.quantity > product.instock) {
        return res.status(400).json({ message: 'Updated quantity exceeds available stock' });
      }

      await cartItem.save();
      return res.status(200).json({ message: 'Cart updated successfully', cartItem });
    }

    // Create new cart entry with description and price fetched from Product
    const cartData = {
      googleId,
      productName,
      productDescription: product.description,
      price: product.price,
      quantity,
    };

    const newCartItem = new Cart(cartData);
    await newCartItem.save();

    // If `saveAsOrder` is true, save the cart item as an order
    if (saveAsOrder) {
      const orderData = {
        googleId,
        productName,
        productDescription: product.description,
        price: product.price,
        quantity,
        status: 'Pending', // Default status
      };

      const newOrder = new Order(orderData);
      await newOrder.save();
    }

    return res.status(201).json({ message: 'Product added to cart successfully', cartItem: newCartItem });
  } catch (error) {
    console.error('Add to cart error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }

    // Handle duplicate key errors (e.g., if productName is not unique)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate product in cart', error: error.message });
    }

    // Generic server error
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { googleId, productName } = req.params;

    // Validate googleId
    if (!googleId) {
      return res.status(400).json({ message: 'Missing googleId in route' });
    }

    // Validate productName
    if (!productName) {
      return res.status(400).json({ message: 'Missing productName in route' });
    }

    // Find and delete the cart item
    const deletedCartItem = await Cart.findOneAndDelete({ googleId, productName });
    if (!deletedCartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    return res.status(200).json({ message: 'Product removed from cart successfully', deletedCartItem });
  } catch (error) {
    console.error('Delete cart error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const getCart = async (req, res) => {
  try {
    const { googleId } = req.params;

    // Validate googleId
    if (!googleId) {
      return res.status(400).json({ message: 'Missing googleId in route' });
    }

    // Fetch all cart items for the user
    const cartItems = await Cart.find({ googleId });
    return res.status(200).json({ message: 'Cart items fetched successfully', cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { addToCart, deleteCart, getCart };