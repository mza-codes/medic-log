import { } from 'dotenv/config';

import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import errorHandler from './middlewares/errorHandler.js';
import { log } from './utils/logger.js';
import { testConnection } from './config/nodemailer.js';
import { connectRedis } from './utils/redisConfig.js';
import { userCookie, refreshCookie } from './controllers/authControllers.js';
import { authRoutes } from './routes/auth.js';
import recordRoutes from './routes/records.js';

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

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    log.error("Values for userCookie,RefreshCookie", userCookie, refreshCookie);
    // testConnection();
    connectRedis();
    log.info(`Node Server Started On PORT: ${PORT}`);
});


// app.use('/', (req, res) => { res.send('Working Done !') });