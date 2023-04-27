import { wss } from '../app.js';
import WebSocket from 'ws';

export const clients: { [key: string]: WebSocket } = {};

export interface IMessage {
  message: string;
  type: 'success' | 'warning' | 'error' | 'regular' | 'progress';
}

export function socketMessage(text: string, type: 'success' | 'warning' | 'error' | 'regular' | 'progress') {
  const message: IMessage = {
    message: text,
    type: type,
  };

  return message;
}

export const webSocketHandlers = async () => {
  wss.on('connection', (ws) => {
    console.log('Websocket connected');
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
