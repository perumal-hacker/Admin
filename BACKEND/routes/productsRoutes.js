import express from "express";
import getProducts  from "../controllers/homeProducts/homeProducts.js";

const router = express.Router();
router.get('/products/',getProducts)

export default router;