import { server } from './app.js';
import { connectMongoDB } from './databases/mongo/connect.js';
import { PORT, MONGODB_URL, PARSER_NAMES } from './configs/app.config.js';
import { createParser } from './services/repositories/parser.service.js';

async function startServer() {
  try {
    await connectMongoDB(MONGODB_URL);

    for (let i = 0; i < PARSER_NAMES.length; i++) {
      try {
        await createParser(PARSER_NAMES[i]);
      } catch (err) {}
    }

    server.listen(PORT, () => {
      console.log(`Client hunter v3 – app listening at port:${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
