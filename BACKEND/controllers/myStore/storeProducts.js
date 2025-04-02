import mongoose from 'mongoose';
import { Dealer } from '../../config/db.js'; // Assuming this is your database connection
import StoreDetails from '../../models/Dealer/dealerStore.model.js'; // Import the StoreDetails model
import Product from '../../models/Dealer/product.model.js'; // Import the Product model

// Function to add a product
export const addProduct = async (req, res) => {
  try {
    const { googleId } = req.params; // Get googleId from the route parameters
    const { productName, description, price, returnPolicy, instock, category} = req.body; // Get product details from the request body

    // Validate required fields
    if (!googleId) {
      return res.status(400).json({ error: 'Google ID is required in the route' });
    } 
    if (!productName || !description || !price || !returnPolicy || !category|| instock === undefined) {
      return res.status(400).json({ error: 'All fields (productName, description, price, returnPolicy, instock) are required' });
    }
 
    // Trim the googleId to avoid whitespace issues
    const trimmedGoogleId = googleId.trim();
 
    // Check if the dealer exists in the StoreDetails collection
    const dealer = await StoreDetails.findOne({ googleId: trimmedGoogleId }).lean();
    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found in StoreDetails collection' });
    }

    // Create a new product object
    const newProduct = {
      productName,
      description,
      price,
      returnPolicy,
      category,
      instock,
      googleId: trimmedGoogleId, // Link the product to the dealer's googleId
    };

    // Save the product to the Products collection
    const savedProduct = await Product.create(newProduct);

    // Return the saved product as the response
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('❌ Error adding product:', error.message);

    // Handle duplicate key error (e.g., if productName is unique)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A product with this name already exists for this dealer' });
    }

    // Handle database connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({
        error: 'Database connection issue',
        details: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
};
//get product

export const getProductsByGoogleId = async (req, res) => {
  try {
    const { googleId } = req.params;

    if (!googleId) {
      return res.status(400).json({ error: 'Google ID is required in the route' });
    }

    // Ensure Dealer exists in StoreDetails collection inside the Dealers database
    const dealerExists = await StoreDetails.findOne({ googleId }).lean();
    
    if (!dealerExists) {
      return res.status(404).json({ error: 'Dealer not found in StoreDetails collection' });
    }

    // Fetch products from Products collection within the same database
    const products = await Product.find({ googleId });

    if (!products.length) {
      return res.status(404).json({ error: 'No products found for this dealer' });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};



//update product
export const updateProduct = async (req, res) => {
  try {
    const { googleId, productName } = req.params; // Get googleId and productName from route
    const { description, price, returnPolicy, instock,category } = req.body; // Updated fields

    // Validate required fields
    if (!googleId || !productName) {
      return res.status(400).json({ error: "Google ID and product name are required in the route" });
    }

    // Trim googleId and productName to avoid whitespace issues
    const trimmedGoogleId = googleId.trim();
    const trimmedProductName = productName.trim();

    // Check if the dealer exists in the StoreDetails collection
    const dealer = await StoreDetails.findOne({ googleId: trimmedGoogleId }).lean();
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found in StoreDetails collection" });
    }

    // Find and update the product in the Products collection
    const updatedProduct = await Product.findOneAndUpdate(
      { googleId: trimmedGoogleId, productName: trimmedProductName }, // Find by googleId & productName
      { description, price, returnPolicy, instock ,category}, // Fields to update
      { new: true } // Return updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found for this dealer" });
    }

    // Return the updated product
    res.status(200).json({ message: "Product updated successfully", updatedProduct });

  } catch (error) {
    console.error("❌ Error updating product:", error.message);

    // Handle database connection errors
    if (error.name === "MongooseError" || error.name === "MongoNetworkError") {
      return res.status(503).json({
        error: "Database connection issue",
        details: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { googleId, productName } = req.params; // Get googleId and productName from route

    // Validate required fields
    if (!googleId || !productName) {
      return res.status(400).json({ error: "Google ID and product name are required in the route" });
    }

    // Trim googleId and productName to avoid whitespace issues
    const trimmedGoogleId = googleId.trim();
    const trimmedProductName = productName.trim();

    // Check if the dealer exists in the StoreDetails collection
    const dealer = await StoreDetails.findOne({ googleId: trimmedGoogleId }).lean();
    if (!dealer) {
      return res.status(404).json({ error: "Dealer not found in StoreDetails collection" });
    }

    // Find and delete the product from the Products collection
    const deletedProduct = await Product.findOneAndDelete({
      googleId: trimmedGoogleId,
      productName: trimmedProductName
    });

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found for this dealer" });
    }

    // Return success response
    res.status(200).json({ message: "Product deleted successfully", deletedProduct });

  } catch (error) {
    console.error("❌ Error deleting product:", error.message);

    // Handle database connection errors
    if (error.name === "MongooseError" || error.name === "MongoNetworkError") {
      return res.status(503).json({
        error: "Database connection issue",
        details: error.message,
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
