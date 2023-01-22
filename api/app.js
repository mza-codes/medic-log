import { } from 'dotenv/config';

import express, { urlencoded } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

import errorHandler from './middlewares/errorHandler.js';
import { log } from './utils/logger.js';
import { testConnection } from './config/nodemailer.js';
import { authRoutes } from './routes/auth.js';
import recordRoutes from './routes/records.js';
import userRoutes from './routes/user.js';

let domain = `http://localhost:3000`;
log.warn("ENVIRONMENT: ", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
    log.warn("PRODUCTION MODE", process.env.NODE_ENV);
    domain = `https://medic-log.netlify.app`;
};

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
    origin: domain,
    credentials: true
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
}));
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(helmet());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/app', recordRoutes);
app.use('/api/v1/user', userRoutes);

// app.get("*", (req, res) => {
//     log.warn("Accessing via *");
//     res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
// });
app.get('/', (req, res) => {
    res.writeHead(301, {
        Location: domain
    }).end();
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    // testConnection();
    // connectRedis();
    log.info(`Node Server Started On PORT: ${PORT}`);
});
