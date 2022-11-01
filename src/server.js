import { config } from 'dotenv';
config();
import express from 'express';
import http from 'http';
import { socketInstance } from './socket/instance.js';
import { CORE_ENGINE } from './coreEngine/index.js';
import { Server } from 'socket.io';
import clientConnect from './redis/index.js';
import { tracingInit } from './utils/tracing.js';
import { roomManager, userManager } from './hooks/index.js';
import authMiddleware from './middlewares/auth.js';

tracingInit();
const app = express();
const redisClient = await clientConnect(process.env.REDIS_AUTH);
const httpServer = http.createServer(app);
const socketConnection = new Server(httpServer, {
  cors: { origin: '*' },
  transports: ['websocket'],
});

socketInstance(socketConnection, redisClient);
CORE_ENGINE(socketConnection, redisClient);

app.use(express.json());
app.use(authMiddleware);

app.post('/r3d1s', async (req, res) => {
  redisClient.set(req.body.key, req.body.value);
  return res.status(201).send();
});

app.post('/t/r3d1s', async (req, res) => {
  const { to, event, data } = req.body;
  socketConnection.to(to).emit(event, data);
  return res.status(201).send({ message: 'Emitted' });
});

app.get('/r3d1s/:id', async (req, res) => {
  const result = await redisClient.get(req.params.id);
  return res.send(result);
});

app.delete('/r3d1s/:id', async (req, res) => {
  redisClient.del(req.params.id);
  return res.status(204).send();
});

app.post('/hook/room/:id', (req, res) => {
  roomManager({ req, res }, socketConnection);
});

app.post('/hook/user', async (req, res) => {
  userManager({ req, res }, socketConnection, redisClient);
});

const WS_SERVER_PORT = process.env.PORT || 8080;
httpServer.listen(WS_SERVER_PORT, () => {
  console.log('Servidor websocket iniciado na porta', WS_SERVER_PORT);
});