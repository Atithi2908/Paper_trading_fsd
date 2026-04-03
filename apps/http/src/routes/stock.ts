import express from "express";
import {Router} from "express";
import { getOrCreateStock, getRelatedStocks, getStockChartData, getStockInfo, getStockQuote, searchStocks } from "../controller/stockController";
import authMiddleware from "../middleware/auth";

const router:Router = Router();

router.get("/:symbol/quote",authMiddleware, getStockQuote);
router.get("/:symbol/info", authMiddleware,getStockInfo);
router.get("/related",authMiddleware,getRelatedStocks);
router.get("/:symbol/getStockChartData",authMiddleware,getStockChartData);
router.post("/entry",authMiddleware,getOrCreateStock);
router.get("/search",searchStocks);
export default router;