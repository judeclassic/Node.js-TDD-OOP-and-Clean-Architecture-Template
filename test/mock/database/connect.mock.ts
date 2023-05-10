import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMockedServer: MongoMemoryServer;

export const dbConnect = async () => {
    const mongoMockedServer = await MongoMemoryServer.create({
        auth: { disable: true },
        instance: {
          auth: true,
          storageEngine: 'wiredTiger',
        },
    });
    const uri = mongoMockedServer.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions;
    await mongoose.connect(uri, mongooseOpts);
};

export const dbDisconnect = async () => {
    await mongoose.connection.close();
    await mongoMockedServer?.stop();
};