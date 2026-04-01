import { configDotenv } from "dotenv";
import Redis from "ioredis";
configDotenv()
const redis = new Redis(process.env.REDIS_URL!);

export default redis;