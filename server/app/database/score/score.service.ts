import { HttpException } from '@app/classes/http-exception/http.exception';
import { Score } from '@app/classes/scores-information/score-information';
import { DATABASE_COLLECTION, DESCENDING_ORDER, DUMMY_SCORES, ERROR_NUMBER, SCORE_NUMBER_LIMIT } from '@app/constants/best-scores';
import { DatabaseService } from '@app/database/database/database.service';
import { Collection, FilterQuery, ObjectId } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';
@Service()
export class ScoresService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<Score> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    /**
     * Retourne les meilleurs scores
     *
     * @param gameMode Mode de jeu
     * @returns Meilleurs scores
     */
    async getBestScores(gameMode: string): Promise<Score[]> {
        return this.collection
            .find({ playerMode: gameMode })
            .sort({ score: DESCENDING_ORDER })
            .limit(SCORE_NUMBER_LIMIT)
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }

    /**
     * Ajoute un score
     *
     * @param score Score à ajouter
     */
    async addScore(score: Score): Promise<void> {
        await this.collection.insertOne(score);
    }

    /**
     * Retourne un score par son identifiant
     *
     * @param id Identifiant du score
     * @returns Score correspondant ou null
     */
    async getScoreById(id: ObjectId): Promise<Score[]> {
        return this.collection
            .find({ _id: id })
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }

    /**
     * Met à jour le nom d'un score
     *
     * @param score Nouveau score
     */
    async updateScoreName(score: Score): Promise<void> {
        return this.collection.updateOne({ score: score.score }, { $push: { name: score.name[0] } }).then();
    }

    /**
     * Récupère un score en particulier
     *
     * @param score Score à récupérer
     * @returns Score correspondant ou null
     */
    async getScoreByPlayerModeAndScore(score: Score): Promise<Score[]> {
        const filterQuery: FilterQuery<Score> = { $and: [{ score: score.score }, { playerMode: score.playerMode }] };
        return this.collection
            .find(filterQuery)
            .toArray()
            .then((scores: Score[]) => {
                return scores;
            });
    }

    /**
     * Supprime tous les scores
     */
    async deleteAllScores(): Promise<void> {
        await this.collection.deleteMany({});
    }

    /**
     * Ajoute des scores de test
     */
    async addDummyScores(): Promise<void> {
        await this.collection.insertMany(DUMMY_SCORES).catch(() => {
            throw new HttpException('Failed to insert course', ERROR_NUMBER);
        });
    }

    /**
     * Ajoute des scores fictifs à la collection
     */
    async resetScores(): Promise<void> {
        await this.deleteAllScores();
        await this.addDummyScores();
    }
}
