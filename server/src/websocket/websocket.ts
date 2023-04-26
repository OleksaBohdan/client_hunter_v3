import { wss } from '../app.js';
import WebSocket from 'ws';

export const clients: { [key: string]: WebSocket } = {};

export const webSocketHandlers = async () => {
  wss.on('connection', (ws) => {
    const handleWebSocketConnection = async (ws: WebSocket) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message.toString());
        if (data.type === 'userId') {
          const userId: string = data.data;
          clients[userId] = ws;
        }
      });

      ws.on('close', () => {
        Object.keys(clients).forEach((userId) => {
          if (clients[userId] === ws) {
            delete clients[userId];
          }
        });
      });
    };

    handleWebSocketConnection(ws);
  });
};
