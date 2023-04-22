import { wss } from '../app.js';
import { User } from '../databases/mongo/models/User.js';
import { Parser } from '../databases/mongo/models/Parser.js';
import { stopFlags } from '../controllers/startParser.controller.js';
import { runCaJobankParser } from '../services/parsers/ca_jobbank.parser/main.ca_jobbank.js';

export function setupWebSocketHandlers() {
  wss.on('connection', (socket) => {
    socket.send('SOCKET CONNECTED');
    socket.on('message', async (message) => {
      const request = JSON.parse(message.toString());
      console.log(request);
      const { id, command } = request;

      const user = await User.findById(id).populate('activeCity').populate('activeKeyword');

      if (!user) {
        return;
      }

      const parser = await Parser.findById(user.parser);

      if (!parser) {
        socket.send('Parser not chosen');
        return;
      }

      if (stopFlags.get(id) == false) {
        socket.send('Parser alreay run');
        return;
      }

      const position = user.activeKeyword ? user.activeKeyword.keyword : '';
      const city = user.activeCity ? user.activeCity.city : '';

      switch (parser.name) {
        case 'jobbank.gc.ca':
          try {
            socket.send('running jobbank.gc.ca');
            await runCaJobankParser(user, city, position, socket);
          } catch (err) {
            stopFlags.set(id, true);
          }
          console.log('running jobbank.gc.ca');
          break;
        case 'xing.com':
          console.log('running xing.com');
          break;
        case 'linkedin.com':
          console.log('running linkedin.com');
          break;
      }
    });
  });
}
