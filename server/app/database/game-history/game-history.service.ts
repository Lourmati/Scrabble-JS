import { GameHistory } from '@app/classes/game-history/game-history';
import { DATABASE_COLLECTION, DESCENDING_ORDER } from '@app/constants/game-history';
import { DatabaseService } from '@app/database/database/database.service';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
@Service()
export class GameHistoryService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<GameHistory> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    /**
     * Retourne l'historique des parties
     *
     * @returns Historique des parties
     */
    async getAllGameHistory(): Promise<GameHistory[]> {
        return this.collection
            .find({})
            .sort({ start: DESCENDING_ORDER })
            .toArray()
            .then((gameHistory: GameHistory[]) => {
                return gameHistory;
            });
    }

    /**
     * Ajoute une partie à l'historique
     *
     * @param game Historique de la partie
     */
    async addGame(game: GameHistory): Promise<void> {
        await this.collection.insertOne(game);
    }

    /**
     * Supprime tous l'historique des parties
     */
    async deleteAllGameHistory(): Promise<void> {
        await this.collection.deleteMany({});
    }

    /**
     * Supprime une partie de l'historique
     *
     * @param gameId Identifiant de la partie
     */
    async deleteGameHistory(gameId: string): Promise<void> {
        await this.collection.deleteOne({ id: gameId });
    }
}
