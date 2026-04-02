import {Router} from 'express';
import authMiddleware from '../middleware/auth';
import { placeOrder } from '../controller/orderController';

const router:Router = Router();

router.post('/buy',authMiddleware,placeOrder);

export default router;