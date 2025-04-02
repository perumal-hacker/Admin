import  Product  from '../../models/Dealer/product.model.js';


 const getProducts = async (req, res) => {
  try {
    // Extract productName from the JSON body
    const { productName } = req.body;

    // Build the query
    let query = {};
    if (productName && typeof productName === 'string' && productName.trim() !== '') {
      // Case-insensitive partial match for productName
      query = { productName: { $regex: productName.trim(), $options: 'i' } };
    }

    // Fetch products based on the query
    const products = await Product.find(query).sort({ createdAt: -1 }); // Sort by creation date (newest first)

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    console.log('Products Found:', products);
    return res.status(200).json({ message: 'Products fetched successfully', products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default getProducts;