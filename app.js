import express from "express";

const app = express();
const domain = `https://mediclog.up.railway.app/`;
const port = process?.env?.PORT ?? 5001;

app.get("/", (req, res) => {
    res.writeHead(301, {
        Location: domain
    }).end();
});

app.get("/medic", (req, res) => {
    res.writeHead(301, {
        Location: `https://medic-log.netlify.app/`
    }).end();
});

app.listen(port, () => {
    console.log(`SERVER STARTED ON PORT: ${port}`);
});