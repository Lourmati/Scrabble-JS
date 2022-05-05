import { DATABASE_CONNEXION_ERROR, DATABASE_NAME, DATABASE_URL } from '@app/constants/best-scores';
import { Db, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

@Service()
export class DatabaseService {
    private client: MongoClient;
    private db: Db;

    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        this.start().then();
    }

    /**
     * Ouvre une connexion avec la base de données
     *
     * @param url Url de la base de donnée
     * @returns Client MongoDB
     */
    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url, this.options);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
        } catch {
            throw new Error(DATABASE_CONNEXION_ERROR);
        }
        return this.client;
    }

    /**
     * Ferme la connexion avec la base de donnée
     */
    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    get database(): Db {
        return this.db;
    }
}
