import { } from 'dotenv/config';

import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from "path";

import errorHandler from './middlewares/errorHandler.js';
import { log } from './utils/logger.js';
import { testConnection } from './config/nodemailer.js';
import { connectRedis } from './utils/redisConfig.js';
import { authRoutes } from './routes/auth.js';
import recordRoutes from './routes/records.js';
import userRoutes from './routes/user.js';

const __dirname = path.resolve();
// Database Connection
const connectDB = async () => {
    await mongoose.connect(process.env.NEWDB, {
        // useCreateIndex: true,
        // useFindAndModify: false,
        // disabled as it clearly shows error: <> MongoParseError: options usecreateindex, usefindandmodify are not supported </>
        useUnifiedTopology: true,
        useNewUrlParser: true,
        dbName: "testMode"
    }).then(() => log.info('MongoDB Connection Success !'))
        .catch((err) => {
            log.error('MongoDB Connection Failed', err);
            process.exit();
        });
};

const app = express();

// Middleware
app.use(cors({
    exposedHeaders: ["user_token"],
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/app', recordRoutes);
app.use('/api/v1/user', userRoutes);

app.get("*", (req, res) => {
    log.warn("SENDING HTML FILE * ROUTE");
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    // testConnection();
    connectRedis();
    log.info(`Node Server Started On PORT: ${PORT}`);
});


// app.use('/', (req, res) => { res.send('Working Done !') });