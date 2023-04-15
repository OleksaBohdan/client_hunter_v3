import { connect, Error } from 'mongoose';
export async function connectMongoDB(url) {
    try {
        await connect(url).then(() => {
            console.log(`MongoDB connected to ${url}`);
        });
    }
    catch (err) {
        if (err instanceof Error) {
            throw err;
        }
    }
}
//# sourceMappingURL=connect.js.map