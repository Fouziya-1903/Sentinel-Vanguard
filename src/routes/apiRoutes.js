import express from 'express';
import { customFixedWindowLimiter } from '../middlewares/sentinelLocalLimiter.middleware';

const router = express.Router();

// Mock controllers to showcase the flow architecture
const getProducts = (req, res) => res.status(200).json({ success: true, products: [] });
const addProduct = (req, res) => res.status(201).json({ success: true, message: "Product created." });

// Option 1: Apply the rate limiter strictly to specific, high-exposure endpoints (e.g., product listing)
router.get('/products', customFixedWindowLimiter(50, 60000), getProducts);

// Option 2: Apply it sequentially to an entire sub-routing pipeline layout
// router.use(apiRateLimiter); 

router.post('/products', addProduct);

export default router;