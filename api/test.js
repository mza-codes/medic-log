import express from "express";
import { } from 'dotenv/config';
import genRes from "./utils/JSONResponse.js";

const app = express();

let data = { record: "this is a record", values: [1, 5, 6, 89] };

app.listen(4000, () => {
    console.log("Running on port", 4000);
});

app.get('/', (req, res) => {
    return genRes(res, 400, false, "Ideal for data", { ...data });
});