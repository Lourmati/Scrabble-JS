import { Application } from '@app/app';
import { Score } from '@app/classes/scores-information/score-information';
import { ScoresService } from '@app/database/score/score.service';
import { expect } from 'chai';
import * as Httpstatus from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('Scores Controllers', () => {
    const baseScoreClassique = {
        name: ['SCH'],
        score: 500,
        playerMode: 'Classique',
    } as Score;
    const baseScoreLog2990 = {
        name: ['SCH'],
        score: 500,
        playerMode: 'Log2990',
    } as Score;
    let scoresService: SinonStubbedInstance<ScoresService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        scoresService = createStubInstance(ScoresService);
        const app = Container.get(Application);
        // eslint-disable-next-line dot-notation
        Object.defineProperty(app['scoresController'], 'scoresService', { value: scoresService });
        expressApp = app.app;
    });

    it('should return score from scoreClassique service on valid get request scoreClassique', async () => {
        scoresService.getBestScores.resolves([baseScoreClassique]);
        return supertest(expressApp)
            .get('/api/scores/scoreClassique')
            .expect(Httpstatus.StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal([baseScoreClassique]);
            });
    });

    it('should return an error as a message on service fail for scoreClassique', async () => {
        scoresService.getBestScores.rejects(new Error('Error'));

        return supertest(expressApp)
            .get('/api/scores/scoreClassique')
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .catch((error) => {
                expect(error.message).to.equal('Error');
            });
    });

    it('should return score from scoreLog2990 service on valid get request scoreLog2990', async () => {
        scoresService.getBestScores.resolves([baseScoreLog2990]);
        return supertest(expressApp)
            .get('/api/scores/scoreLog2990')
            .expect(Httpstatus.StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal([baseScoreLog2990]);
            });
    });
    it('should return an error as a message on service fail for scoreLog2990', async () => {
        scoresService.getBestScores.rejects(new Error('Error'));
        return supertest(expressApp)
            .get('/api/scores/scoreLog2990')
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .catch((error) => {
                expect(error.message).to.equal('Error');
            });
    });

    it('should return score from resetScore service on valid get request resetScore', async () => {
        scoresService.resetScores.resolves();
        return supertest(expressApp)
            .delete('/api/scores/resetScore')
            .expect(Httpstatus.StatusCodes.OK)
            .then((response) => {
                expect(response.body).to.deep.equal({});
            });
    });

    it('should return an error as a message on service fail for resetScore', async () => {
        scoresService.resetScores.rejects(new Error('Error'));
        return supertest(expressApp)
            .delete('/api/scores/resetScore')
            .expect(Httpstatus.StatusCodes.NOT_FOUND)
            .catch((error) => {
                expect(error.message).to.equal('Error');
            });
    });
});
