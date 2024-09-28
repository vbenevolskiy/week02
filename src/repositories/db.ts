import {MongoClient} from 'mongodb';

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017';

export const dbClient = new MongoClient(mongoURI);

export  const ConnectDB = async () => {
    try {
        await dbClient.connect();
        await dbClient.db("blogs").command({ping: 1});
        console.log("Connected to DB");
    } catch {
        await dbClient.close();
    }
}