import dotenv from 'dotenv';
import connectDb from './config/dbConfig.js';
import express from 'express';
import authRouter from './router/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true // this is for setting cookies
}))

// db connection
connectDb();

app.use('/api/auth', authRouter)
app.use('/', (req, res) => {
    res.status(200).json({ data: 'Express JWT Auth.' })
})

export default app;