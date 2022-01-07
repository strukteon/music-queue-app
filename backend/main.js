import express from 'express';
import bodyParser from "body-parser";
import http from 'http';
import cors from 'cors';
import fs from "fs";
import { RoomManager } from "./RoomManager.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

new RoomManager(app, server);

app.use(express.static("../frontend/dist"))

app.use('*', (req, res) => {
    fs.readFile("../frontend/dist/index.html", 'utf-8', function(err, page) {
        res.write(page);
        res.end();
    });
});

server.listen(80, () => console.log('server started.'));