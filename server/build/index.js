import { app } from './app.js';
import { connectMongoDB } from './databases/mongo/connect.js';
import { PORT, MONGODB_URL } from './configs/app.config.js';
async function startServer() {
    try {
        await connectMongoDB(MONGODB_URL);
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Client hunter v3 – app listening at port:${PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map