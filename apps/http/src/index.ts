import dotenv from "dotenv";
dotenv.config();
import express, {Request,Response} from 'express'
import authRoutes from './routes/auth'
import postRoute from './routes/post';
import stockRoutes from "./routes/stock";
import orderRoutes from "./routes/order";
import userRoutes from "./routes/user";
import cors from "cors";
//import { startLimitOrderCron } from './cron/limitOrderCron';


const app = express();

const port = 3000;
app.use(express.json());
app.use(cors());

app.use('/user',authRoutes);
app.use('/post',postRoute);
app.use('/stock',stockRoutes);
app.use('/order', orderRoutes);
app.use("/user",userRoutes);
//startLimitOrderCron();

app.listen(3000, () => console.log("Server is running on port 3000"));
