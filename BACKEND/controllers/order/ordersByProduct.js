import Product from '../../models/Dealer/product.model.js';
import Order from '../../models/Customer/order.model.js';

const getOrdersByProductName = async (req, res) => {
  try {
    // Extract productName from the JSON body (like your Postman test)
    const { productName } = req.body;

    // Validate input
    if (!productName || typeof productName !== 'string' || productName.trim() === '') {
      return res.status(400).json({ message: 'productName is required and must be a non-empty string' });
    }

    // Find the product to get its _id (since orders store productName as an ObjectId)
    const product = await Product.findOne({
      productName: { $regex: productName.trim(), $options: 'i' }, // Case-insensitive match
    });

    if (!product) {
      return res.status(404).json({ message: `No product found with name: ${productName}` });
    }

    // Fetch orders where productName matches the product's _id
    const orders = await Order.find({ productName: product._id })
      .populate('productName', 'productName description price') // Populate product details
      .sort({ createdAt: -1 }); // Newest first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: `No orders found for product: ${productName}` });
    }

    console.log('Orders Found:', orders);
    return res.status(200).json({
      message: 'Orders fetched successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Get orders by product name error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export default getOrdersByProductName;