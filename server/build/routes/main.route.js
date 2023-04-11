export default async function myRoute(fastify) {
    fastify.get('/me', async (request, reply) => {
        return { message: 'Hello, world!' };
    });
}
//# sourceMappingURL=main.route.js.map