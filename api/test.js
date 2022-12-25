import express from "express";
import {} from 'dotenv/config';

console.log("imported file");

const app = express()

app.listen(4000,() => {
    console.log("Running on a44");
    console.log("ENV Variables",process.env);
    console.log("Keys::",process.env.JWT_KEY);
});