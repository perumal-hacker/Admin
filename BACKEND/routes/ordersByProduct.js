import express from 'express';
import getOrdersByProductName from '../controllers/order/ordersByProduct.js';

const router = express.Router();

// GET endpoint to fetch orders by productName (using body for consistency with your Postman test)
router.get('/orders/by-product', getOrdersByProductName);

export default router;