import { wss } from '../app.js';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { stopFlags } from '../controllers/startParser.controller.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export interface IMessage {
  message: string;
  type: 'success' | 'warning' | 'error' | 'regular';
}

export function setupWebSocketHandlers() {
  wss.on('connection', (socket) => {
    const message: IMessage = {
      message: 'Websocket connected',
      type: 'regular',
    };
    socket.send(JSON.stringify(message));

    socket.on('message', async (message) => {
      const request = JSON.parse(message.toString());
      const { id, command } = request;

      if (command === 'START') {
        const user = await User.findById(id).populate('activeCity').populate('activeKeyword');

        if (!user) {
          const message: IMessage = {
            message: 'User not authorized',
            type: 'error',
          };
          socket.send(JSON.stringify(message));
          return;
        }

        const parser = await Parser.findById(user.parser);

        if (!parser) {
          const message: IMessage = {
            message: 'Parser not chosen',
            type: 'error',
          };
          socket.send(JSON.stringify(message));
          return;
        }

        if (stopFlags.get(id) == false) {
          const message: IMessage = {
            message: 'Parser alreay running',
            type: 'error',
          };
          socket.send(JSON.stringify(message));

          return;
        }

        const position = user.activeKeyword ? user.activeKeyword.keyword : '';
        const city = user.activeCity ? user.activeCity.city : '';

        switch (parser.name) {
          case 'jobbank.gc.ca':
            try {
              const message: IMessage = {
                message: 'START',
                type: 'regular',
              };
              socket.send(JSON.stringify(message));

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
