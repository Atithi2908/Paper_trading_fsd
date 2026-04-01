import {Router} from "express";
import { createPost, fetchComment, fetchPosts, postComment } from "../controller/postController";
import authMiddleware from '../middleware/auth';                                                                                                                          
const router:Router = Router();
router.post('/create',authMiddleware,createPost);
router.post('/comment',authMiddleware,postComment);
router.get('/fetchComment',authMiddleware,fetchComment);
router.get('/fetchPost',authMiddleware,fetchPosts);
export default router;