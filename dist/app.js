import express from 'express';
//import { userRoutes } from './routes/index.ts';
import cors from 'cors';
import { connectDB } from "./db/index.js";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: process.env.CORS_ORIGIN, exposedHeaders: ['WWW-Authenticate'] }));
app.use(express.json());
//app.use('/users', userRoutes);
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the main app!'
    });
});
async function start() {
    try {
        console.log("ENV CHECK:", {
            mongo: process.env.MONGO_URI ? "exists" : "missing",
            nodeEnv: process.env.NODE_ENV
        });
        await connectDB();
        app.listen(port, () => {
            console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
start();
