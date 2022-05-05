import { DATABASE_NAME } from '@app/constants/best-scores';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

export class DatabaseServiceMock {
    mongoServer: MongoMemoryServer;
    private db: Db;
    private client: MongoClient | undefined;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    async start(): Promise<MongoClient | null> {
        if (!this.client) {
            this.mongoServer = await MongoMemoryServer.create();
            const mongoUri = await this.mongoServer.getUri();
            this.client = await MongoClient.connect(mongoUri, this.options);
            this.db = this.client.db(DATABASE_NAME);
        }

        return this.client;
    }

    async closeConnection(): Promise<void> {
        if (this.client) {
            return this.client.close();
        } else {
            return Promise.resolve();
        }
    }
    async populateDb(collectionName: string, data: unknown[]) {
        await this.db.createCollection(collectionName);
        await this.db.collection(collectionName).countDocuments();
        this.db.collection(collectionName).insertMany(data);
    }

    get database(): Db {
        return this.db;
    }
}
