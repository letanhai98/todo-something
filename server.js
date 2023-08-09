
import express, { json, urlencoded } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { Server } from 'http';
import connectMongoDB from './db/mongodb';
import { errorHandler } from './middlewares/error-handlers';
import { customLogger } from './middlewares/logger';

dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.EXPRESS_PORT || 3000;
const app = express();

app.use(cors('*'));
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ extended: false, limit: '50mb' }));
app.use(customLogger);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));
app.use(routes);
app.use(errorHandler);

connectMongoDB();

const httpServer = new Server(app);

httpServer.listen(PORT, async function () {
  console.log(`something-backend started on port ${PORT}`);
});