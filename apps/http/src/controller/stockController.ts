import { Request, Response } from "express";
import axios from "axios";
const FINNHUB_BASE = "https://finnhub.io/api/v1";
const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
import { prisma } from "../lib/prisma";


export const getStockQuote = async (req: Request, res: Response) => {
    console.log("request to getStock ");
  const { symbol } = req.params;

  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching stock quote:", err);
    res.status(500).json({ error: "Failed to fetch stock quote" });
  }
};

export const getStockInfo = async (req: Request, res: Response) => {
  console.log("request came to get stock info");
  let { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }

  try {
    const finnhubRes = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2`,
      {
        params: {
          symbol,
          token: FINNHUB_KEY
        },
         validateStatus: () => true 
      }
    );

    const finnhubData = finnhubRes.data;

    if (finnhubData && finnhubData.name) {
      return res.json({
        ...finnhubData,
        source: "finnhub"
      });
    }

    console.log("Finnhub empty → falling back to Yahoo");

    const yahooSymbol = symbol.includes(".")
      ? symbol
      : `${symbol}.NS`;

    const yahooRes = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}`,
      {
        params: {
          interval: "1d",
          range: "1m"
        }
      }
    );

    const result = yahooRes.data?.chart?.result?.[0];
    if (!result) {
      throw new Error("Yahoo returned no data");
    }

    const meta = result.meta;

    return res.json({
      symbol: meta.symbol,
      name: meta.longName || meta.shortName,
      exchange: meta.exchangeName,
      currency: meta.currency,
      price: meta.regularMarketPrice,
      logo: null, // use Clearbit or stored logo
      source: "yahoo"
    });

  } catch (err) {
    console.error("getStockInfo error:", err);
    return res.status(500).json({ message: "Failed to fetch stock info" });
  }
};


export const getRelatedStocks = async(req:Request,res:Response)=>{
  console.log("Request to get related stocks");
  const {q} = req.query;
  
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }
  try{
    const response = await axios.get(
      `https://finnhub.io/api/v1/search?q=${q}&token=${FINNHUB_KEY}`

    )
    const results = response.data.result;
       const filtered = results.filter((item: any) =>
      ["Common Stock", "EQS", "ADR", "ETF"].includes(item.type)
    );
    res.status(200).json(filtered);

  }
  catch(e){
    res.status(400).json({message:"Request failed to fetch related stocks",error:e});
  }
}

export const searchStocks = async (req: Request, res: Response) => {
  try {
    console.log("request to search stock");
    const query = req.query.q as string;

    if (!query) {
      return res.status(400).json({ message: "Query is required" });
    }

    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Finnhub API key missing" });
    }

    const response = await axios.get(
      "https://finnhub.io/api/v1/search",
      {
        params: {
          q: query,
          token: apiKey,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error("Finnhub search error:", error);
    return res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

export const getOrCreateStock = async (req: Request, res: Response) => {
  try {
    console.log("request came to get or create stock");

    let { symbol } = req.body;

    if (!symbol) {
      return res.status(400).json({ message: "Symbol is required" });
    }

    symbol = symbol.toUpperCase();

    const stock = await prisma.stock.upsert({
      where: { symbol },
      update: {}, 
      create: {
        symbol,
        name: symbol,
        exchange: null,
        currency: null,
        type: null
      }
    });

    return res.status(200).json(stock);

  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Failed to fetch/create stock", error: e });
  }
};

export const getStockChartData = async (req:Request, res:Response) => {
  const { symbol } = req.params;
  const range = req.query.range || "1mo"; 
  let interval = "1d";
  if (range === "1d") {
    interval = "1m";
  } else if (range === "5d") {
    interval = "1h";
  }

  try {
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    const response = await axios.get(url);

    const result = response.data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];


    const formattedData = timestamps.map((ts:number, i:number) => {
      const date = new Date(ts * 1000);
      let time;
      if (range === "1d") {
        time = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });
      } else {
        time = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }

      return {
        time,
        date,
        price: quotes.close[i],
        open: quotes.open[i],
        high: quotes.high[i],
        low: quotes.low[i],
        volume: quotes.volume[i]
      };
    });

    res.json({
      symbol: result.meta.symbol,
      currency: result.meta.currency,
      range: range,
      data: formattedData
    });

  } catch (error) {
    console.error("Error fetching Yahoo chart data:", error);
    res.status(500).json({ error: "Failed to fetch stock chart data" });
  }
};