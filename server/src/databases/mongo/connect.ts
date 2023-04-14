import { connect, Error } from 'mongoose';

export async function connectMongoDB(url: string) {
  try {
    await connect(url).then(() => {
      console.log(`MongoDB connected to ${url}`);
    });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
  }
}
