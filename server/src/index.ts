import { app } from './app.js';
import { PORT } from './configs/app.config.js';

async function startServer() {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Client hunter v3 – app listening at port:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
