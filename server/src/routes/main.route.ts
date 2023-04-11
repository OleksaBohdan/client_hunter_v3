import { FastifyInstance } from 'fastify';

export default async function myRoute(fastify: FastifyInstance) {
  fastify.get('/me', async (request, reply) => {
    return { message: 'Hello, world!' };
  });
}
