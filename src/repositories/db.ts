import {MongoClient} from 'mongodb';
import {SETTINGS} from "../settings";

const mongoURI: string = process.env.MONGO_URI || SETTINGS.MONGO_URI;

export const dbName: string = process.env.DB_NAME || SETTINGS.DB_NAME;

export const dbClient = new MongoClient(mongoURI);

export  const ConnectDB = async () => {
    try {
        await dbClient.connect();
        await dbClient.db(dbName).command({ping: 1});
        console.log(`Connected to DB ${dbName}!`);
    } catch {
        await dbClient.close();
    }
}