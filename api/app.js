require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler');
const helmet = require('helmet');
const { log } = require('./utils/logger');
const { sendEmail } = require('./config/nodemailer');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('express');

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
app.use(urlencoded({ extended: true}));
app.use(cookieParser());
app.use(express.json());
app.use(helmet());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    connectDB();
    log.info(`Node Server Started On PORT: ${PORT}`);
});


// app.use('/', (req, res) => { res.send('Working Done !') });