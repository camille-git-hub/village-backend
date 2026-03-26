import '#db';
import express from 'express';
//import { userRoutes } from './routes/index.ts';
import cors from 'cors';
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
app.listen(port, () => console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`));
