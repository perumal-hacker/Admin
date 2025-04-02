import express from "express";
import { createOrderbyId, getOrdersById ,getAllOrders,updateOrderById,deleteOrderById} from "../controllers/order/order.js";


const router = express.Router();

// Single route for creating an order
router.post('/:googleId/:productName/order', createOrderbyId);
router.get('/order/:googleId/:productName?', getOrdersById);
router.get('/order', getAllOrders);
router.put('/orders/:orderId', updateOrderById);
router.delete('/orders/:orderId', deleteOrderById);


export default router;