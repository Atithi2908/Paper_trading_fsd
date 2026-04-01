import {Router} from 'express';

import authMiddleware from '../middleware/auth';
import { getUserOrderHistory, getUserPortfolio, getUserTradeHistory , getDetails} from '../controller/userController';

const router:Router = Router();

router.get('/orders',authMiddleware,getUserOrderHistory);

router.get('/portfolio',authMiddleware,getUserPortfolio);

router.get('/trades',authMiddleware, getUserTradeHistory);
router.get('/getDetails',authMiddleware, getDetails);


export default router;