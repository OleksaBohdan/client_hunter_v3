import { wss } from '../app.js';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export const stopFlags = new Map();

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

export function setupWebSocketHandlers() {
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify(socketMessage('Parser ready to run', 'regular')));

    socket.on('message', async (message) => {
      const request = JSON.parse(message.toString());
      const { id, command } = request;

      if (command === 'START') {
        const user = await User.findById(id).populate('activeCity').populate('activeKeyword');

        if (!user) {
          socket.send(JSON.stringify(socketMessage('User not authorized', 'error')));
          return;
        }

        const parser = await Parser.findById(user.parser);

        if (!parser) {
          socket.send(JSON.stringify(socketMessage('Parser not chosen', 'error')));
          return;
        }

        if (stopFlags.get(id) == false) {
          socket.send(JSON.stringify(socketMessage('Parser alreay running', 'warning')));

          return;
        }

        const position = user.activeKeyword ? user.activeKeyword.keyword : '';
        const city = user.activeCity ? user.activeCity.city : '';

        switch (parser.name) {
          case 'jobbank.gc.ca':
            try {
              socket.send(JSON.stringify(socketMessage('START', 'regular')));

              await runCaJobankParser(user, city, position, socket);
            } catch (err) {
              stopFlags.set(id, true);
            }
            break;
          case 'xing.com':
            console.log('running xing.com');
            break;
          case 'linkedin.com':
            console.log('running linkedin.com');
            break;
        }
      }

      if (command === 'STOP') {
        stopFlags.set(id, true);
      }
    });
  });
}
