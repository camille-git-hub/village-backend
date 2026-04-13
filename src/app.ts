import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/index.ts';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import listingRoutes from './routes/listingRoutes.ts';
import chatRoutes from './routes/chatRoutes.ts';
import http from 'http';
import { errorHandler, notFoundHandler } from '#middleware';
import { initializeSocket } from './services/socketService.ts';


console.log("Mongoose version:", mongoose.version);

const app = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);

const io = initializeSocket(httpServer);

app.use(cors({ 
    origin: process.env.CORS_ORIGIN, 
    exposedHeaders: ['WWW-Authenticate'],
    credentials: true
}));

app.use(express.json(), cookieParser());

app.use('/listings', listingRoutes);
app.use('/chats', chatRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the main app!'
    });
});


app.use(notFoundHandler);
app.use(errorHandler);

    try {
        await connectDB();
        httpServer.listen(port, () => {
            console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`);
        });
    } catch (error) {
    console.error(error);
    process.exit(1);
    }

