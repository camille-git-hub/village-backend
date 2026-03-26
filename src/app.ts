import '#db';
import express from 'express';
//import { userRoutes } from './routes/index.ts';

const app = express();
const port = 3000;

app.use(express.json());
//app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the main app!'
    });
});

app.listen(port, () =>
    console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`)
);