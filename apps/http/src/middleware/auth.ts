import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtUserPayload {
  userId: number;
  username: string;
}
declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}



const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("request came to authMiddleware");
    if (req.method === "OPTIONS") {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 
 // console.log("token found");
  console.log(token);
  

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtUserPayload;
    console.log(decoded);
    
    req.user = decoded; 
    console.log("req.user is");
   console.log(req.user);
    next(); 
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;