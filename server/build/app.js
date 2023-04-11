import fastify from 'fastify';
import myRoute from './routes/main.route.js';
export const server = fastify({ logger: false });
server.register(myRoute);
//# sourceMappingURL=app.js.map