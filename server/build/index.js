import Fastify from 'fastify';
const server = Fastify({});
const opts = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};
server.get('/ping', opts, async (request, reply) => {
    return { pong: 'it worked!' };
});
const start = async () => {
    try {
        await server.listen({ port: 3000 });
        const address = server.server.address();
        const port = typeof address === 'string' ? address : address === null || address === void 0 ? void 0 : address.port;
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=index.js.map