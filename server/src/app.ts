import fastify, { FastifyInstance } from 'fastify';
import myRoute from './routes/main.route.js';

export const server: FastifyInstance = fastify({ logger: false });

server.register(myRoute);
