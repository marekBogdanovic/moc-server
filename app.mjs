import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import http from 'http';
import https from 'https';
import { credentials, generateRouting } from './extras.mjs';

// Import envs
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const app = express();
app.use(cors()); // Cors "*"
app.use('/', router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server routing generated for all json files in /moc folder
generateRouting(router);

// Server creation
const port = parseInt(process.env.PORT || 3003);
const serverMessage = (m) => () => {
  console.log(`Started ${m} server on PORT ${port}, try ${m.toLowerCase()}://localhost:${port}`);
}

if (process.env.HTTPS) {
  const httpsServer = https.createServer(credentials(), app);
  httpsServer.listen(port, serverMessage('HTTPS'));
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(port, serverMessage('HTTP'));
}