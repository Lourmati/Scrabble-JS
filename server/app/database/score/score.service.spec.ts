/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Score } from '@app/classes/scores-information/score-information';
import { DUMMY_SCORE_NUMBER, MODE_CLASSIQUE, MODE_LOG2990 } from '@app/constants/best-scores';
import { DatabaseServiceMock } from '@app/database//database/database.service.mock';
import { DatabaseService } from '@app/database/database/database.service';
import { ScoresService } from '@app/database/score/score.service';
import * as chai from 'chai';
import { expect } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { describe } from 'mocha';
import { MongoClient, ObjectId } from 'mongodb';

chai.use(chaiAsPromised); // this allows us to test for rejection

describe('Score service', () => {
    let scoresServices: ScoresService;
    let databaseService: DatabaseServiceMock;
    let client: MongoClient | undefined;
    const MOCK_SCORE_CLASSIQUE: Score = {
        name: ['NIKOLAY'],
        score: 500,
        playerMode: 'Classique',
    };
    const MOCK_SCORE_LOG2990 = {
        name: ['SATOSHI'],
        score: 480,
        playerMode: 'Log2990',
    };
    const MOCK_SCORE_WITH_ID = {
        _id: new ObjectId('62360a8ca6dcb939207c5849'),
        name: ['BOOBA'],
        score: 300,
        playerMode: 'Classique',
    };
    const populateDb = async (...score: Score[]) => {
        await databaseService.populateDb('Scores', score);
    };
    beforeEach(async () => {
        databaseService = new DatabaseServiceMock();
        client = (await databaseService.start()) as MongoClient;
        scoresServices = new ScoresService(databaseService as unknown as DatabaseService);
        databaseService.start();
    });

    afterEach(async () => {
        await databaseService.closeConnection();
    });

    it('getBestScores should get all classique scores from DB', async () => {
        await populateDb(MOCK_SCORE_CLASSIQUE);
        const scores = await scoresServices.getBestScores(MODE_CLASSIQUE);
        expect(scores.length).to.equal(1);
        expect(MOCK_SCORE_CLASSIQUE).to.deep.equals(scores[0]);
    });

    it('getBestScores should get all log2990 scores from DB', async () => {
        await populateDb(MOCK_SCORE_LOG2990);
        const scores = await scoresServices.getBestScores(MODE_LOG2990);
        expect(scores.length).to.equal(1);
        expect(MOCK_SCORE_LOG2990).to.deep.equals(scores[0]);
    });

    it('should insert a new score', async () => {
        const score: Score = {
            name: ['VITALIK'],
            score: 500,
            playerMode: 'Classique',
        };

        await scoresServices.addScore(score);
        const scores = await scoresServices.collection.find({}).toArray();
        expect(scores.length).to.equal(1);
        expect(scores.find((x) => x.name === score.name)).to.be.undefined;
    });

    it('should get specific score using id with valid subjectCode', async () => {
        await populateDb(MOCK_SCORE_WITH_ID);
        const course = await scoresServices.getScoreById(new ObjectId('62360a8ca6dcb939207c5849'));
        expect(course[0]).to.deep.equals(MOCK_SCORE_WITH_ID);
    });

    it('should update score name if a valid score is sent', async () => {
        await populateDb(MOCK_SCORE_WITH_ID);
        const scoreToUpdateName: Score = {
            _id: new ObjectId('62360a8ca6dcb939207c5849'),
            name: ['khapta'],
            score: 300,
            playerMode: 'Classique',
        };
        const resultScore: Score = {
            _id: new ObjectId('62360a8ca6dcb939207c5849'),
            name: ['BOOBA', 'khapta'],
            score: 300,
            playerMode: 'Classique',
        };
        await scoresServices.updateScoreName(scoreToUpdateName);
        const scores = await scoresServices.collection.find({}).toArray();
        expect(scores[0]).to.deep.equals(resultScore);
    });

    it('should get specific score based on its score, playerMode', async () => {
        const testScore = {
            name: ['wsh'],
            score: 500,
            playerMode: 'Classique',
        };
        await populateDb(testScore);
        const score = await scoresServices.getScoreByPlayerModeAndScore(MOCK_SCORE_CLASSIQUE);
        expect(score.length).to.not.be.equal(0);
    });

    it('should delete all existing scores in the collection', async () => {
        const testScore = {
            name: ['wsh'],
            score: 500,
            playerMode: 'Classique',
        };
        await populateDb(testScore);
        await scoresServices.deleteAllScores();
        const scores = await scoresServices.collection.find({}).toArray();
        expect(scores.length).to.equal(0);
    });

    it('should insert dummy scores', async () => {
        await scoresServices.addDummyScores();
        const scores = await scoresServices.collection.find({}).toArray();
        expect(scores.length).to.equal(DUMMY_SCORE_NUMBER);
    });

    it('should reset all score when reset scores is called', async () => {
        await populateDb(MOCK_SCORE_CLASSIQUE);
        await scoresServices.resetScores();
        const scores = await scoresServices.collection.find({}).toArray();
        expect(scores.length).to.equal(DUMMY_SCORE_NUMBER);
    });

    // Error handling
    describe('Error handling', async () => {
        it('should throw an error if we try to get all courses of a specific teacher on a closed connection', async () => {
            await client?.close();
        });

        it('close connection should return a promise when client is undefined', async () => {
            // eslint-disable-next-line dot-notation
            databaseService['client'] = undefined;
            databaseService.closeConnection();
            expect(true);
        });

        it('should throw an error if we try to add dummy scores on a closed connection', async () => {
            await client?.close();
            expect(scoresServices.addDummyScores()).to.eventually.be.rejectedWith(Error);
        });
    });
});
