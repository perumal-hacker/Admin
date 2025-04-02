// controllers/homeProducts/homeProducts.js
import ProductModule from '../../models/Dealer/product.model.js';
const Product = ProductModule.default; // Access the default export

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;

    let products;
    if (category) {
      products = await Product.find({ category: new RegExp(`^${category}$`, 'i') });
    } else {
      products = await Product.find();
    }

    if (!products || products.length === 0) {
      return res.status(200).json({ message: 'No products found', products: [] });
    }

    return res.status(200).json({ message: 'Products retrieved successfully', products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default getProducts ;