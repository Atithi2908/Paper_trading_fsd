import { Request,Response, NextFunction } from "express";
function testMonitorMiddleware(req:Request, res:Response, next:NextFunction) {
  const startTime = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - startTime;
    console.log(
      `[MONITOR] ${req.method} ${req.originalUrl} | status=${res.statusCode} | latency=${latency}ms`
    );
  });

  next();
}

export default testMonitorMiddleware;