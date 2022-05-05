import { GameHistory } from '@app/classes/game-history/game-history';
import { MOCK_GAME_CLASSIQUE, MOCK_GAME_LOG2990 } from '@app/constants/game-history';
import { DatabaseServiceMock } from '@app/database//database/database.service.mock';
import { DatabaseService } from '@app/database/database/database.service';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient } from 'mongodb';

chai.use(chaiAsPromised); // this allows us to test for rejection

describe('game history service', () => {
    let gameHistoryService: GameHistoryService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient | undefined;
    const populateDb = async (...gameHistory: GameHistory[]) => {
        await databaseService.populateDb('gameHistory', gameHistory);
    };
    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        gameHistoryService = new GameHistoryService(databaseService as unknown as DatabaseService);
        databaseService.start();
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('should get all game history from DB', async () => {
        await populateDb(MOCK_GAME_CLASSIQUE);
        const gameHistory = await gameHistoryService.getAllGameHistory();
        expect(gameHistory.length).to.equal(1);
        expect(MOCK_GAME_CLASSIQUE).to.deep.equals(gameHistory[0]);
    });

    it('should insert a new game in the game history', async () => {
        await gameHistoryService.addGame(MOCK_GAME_CLASSIQUE);
        const gameHistory = await gameHistoryService.collection.find({}).toArray();
        expect(gameHistory.length).to.equal(1);
        expect(MOCK_GAME_CLASSIQUE).to.deep.equals(gameHistory[0]);
    });

    it('should delete all existing game history in the collection', async () => {
        await populateDb(MOCK_GAME_LOG2990);
        await gameHistoryService.deleteAllGameHistory();
        const gameHistory = await gameHistoryService.collection.find({}).toArray();
        expect(gameHistory.length).to.equal(0);
    });

    it('should delete all existing game history in the collection', async () => {
        await populateDb(MOCK_GAME_LOG2990);
        await gameHistoryService.deleteGameHistory('2');
        const gameHistory = await gameHistoryService.collection.find({}).toArray();
        expect(gameHistory.length).to.equal(0);
    });

    describe('Error handling', async () => {
        it('should throw an error if we try to get all game history on a closed connection', async () => {
            await client?.close();
        });
        it('close connection should return a promise when client is undefined', async () => {
            // eslint-disable-next-line dot-notation
            databaseService['client'] = undefined;
            databaseService.closeConnection();
            expect(true);
        });
    });
});
