import "dotenv/config";

import express, { urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";

import ENV from "./utils/validateEnv.js";
import errorHandler from "./middlewares/errorHandler.js";
import { log } from "./utils/logger.js";
import { testConnection } from "./config/nodemailer.js";
import { authRoutes } from "./routes/auth.js";
import recordRoutes from "./routes/records.js";
import userRoutes from "./routes/user.js";
import { decodeBody } from "./middlewares/decodeBody.js";
import ErrorResponse from "./utils/errorResponse.js";
import adminRoutes from "./routes/admin.js";

const __dirname = path.resolve();
export let domain = `http://localhost:3000`;

log.warn("ENVIRONMENT: ", process.env.NODE_ENV);

if (ENV.isProduction) {
    log.warn("PRODUCTION MODE ENTERED: ", process.env.NODE_ENV);
    domain = `https://medic-log.netlify.app`;
}

// Database Connection
const connectDB = async () => {
    await mongoose
        .connect(ENV.NEWDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            dbName: "testMode",
        })
        .then(() => log.info("MongoDB Connection Success !"))
        .catch((err) => {
            log.error("MongoDB Connection Failed", err);
            process.exit();
        });
};

const app = express();

// Middleware
app.use(
    cors({
        exposedHeaders: ["authorization"],
        origin: domain,
        credentials: true,
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key',
        // 'x-client-token', 'x-client-secret', 'Authorization'],
    })
);

app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(express.static("build"));
app.use(helmet());

// Redirect - conf
app.use("/_redirects", express.static(path.join(__dirname, "/build/public/_redirects")));

// Routes
// app.use(decodeBody);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/app", recordRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/super-user", adminRoutes);

app.get("/", (req, res) => {
    log.warn("Accessing via *");
    res.sendFile(`${__dirname}/build/index.html`);
});

app.get("*", (req, res) => {
    log.warn("Accessing via *");
    res.sendFile(`${__dirname}/build/index.html`);
});

// app.get("*", (req, res) => {
//     res.redirect("/");
// });

// app.get('/', (req, res) => {
//     res.writeHead(301, {
//         Location: domain
//     }).end();
// });

// app.use((req, res, next) => {
//     next(new ErrorResponse("Route not Found!",404));
// });

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    if (ENV.isProduction) testConnection();
    // connectRedis();
    log.info(`Node Server Started On PORT: ${PORT}`);
});
