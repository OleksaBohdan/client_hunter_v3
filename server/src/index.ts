import { PORT } from './configs/config.js';
import { server } from './app.js';

const start = async () => {
  try {
    await server.listen({ port: +PORT });
    console.log(`Server started on port: ${PORT}`);
    server.log.info({}, `Server started on port: ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
