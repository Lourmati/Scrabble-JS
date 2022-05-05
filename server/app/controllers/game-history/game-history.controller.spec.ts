import { Application } from '@app/app';
import { MOCK_GAME_LOG2990, MOCK_GAME_CLASSIQUE } from '@app/constants/game-history';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Game History Controller', () => {
    let gameHistoryService: SinonStubbedInstance<GameHistoryService>;
    let expressApp: Express.Application;
    beforeEach(async () => {
        gameHistoryService = createStubInstance(GameHistoryService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['gameHistoryController'], 'gameHistoryService', { value: gameHistoryService });
        expressApp = app.app;
    });

    it('should return game history from gameHistoryService service on valid get request gameHistory', async () => {
        const MOCK_GAME_ARRAY = [MOCK_GAME_LOG2990, MOCK_GAME_CLASSIQUE];
        gameHistoryService.getAllGameHistory.resolves(MOCK_GAME_ARRAY);
        return supertest(expressApp)
            .get('/api/game-history/gameHistory')
            .expect(Httpstatus.StatusCodes.OK)
            .then((response) => {
                // expect(response.body).to.deep.equal([MOCK_GAME_LOG2990]);
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let i = 0; i < MOCK_GAME_ARRAY.length; i++) {
                    const actualDate = new Date(response.body[i].start);
                    expect(actualDate).to.deep.equal(MOCK_GAME_ARRAY[i].start);
                    expect(response.body[i].duration).to.deep.equal(MOCK_GAME_ARRAY[i].duration);
                    expect(response.body[i].players).to.deep.equal(MOCK_GAME_ARRAY[i].players);
                    expect(response.body[i].gameMode).to.deep.equal(MOCK_GAME_ARRAY[i].gameMode);
                }
            });
    });

    it('should return an error as a message on service fail for gameHistory', async () => {
        gameHistoryService.getAllGameHistory.rejects(new Error('Error'));

        return supertest(expressApp)
            .get('/api/game-history/gameHistory')
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .catch((error) => {
                expect(error.message).to.equal('Error');
            });
    });
});
