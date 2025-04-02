import express from 'express';
import { addToCart} from '../controllers/userCart/userCart.js';
import { getCart} from '../controllers/userCart/userCart.js';
import { deleteCart} from '../controllers/userCart/userCart.js';

const router = express.Router();

router.post('/:googleId/:productName/cart', addToCart);
router.get('/:googleId/:productName/cart',getCart);
router.delete('/:googleId/:productName/cart/delete',deleteCart);

export default router;
