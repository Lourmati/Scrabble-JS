/* eslint-disable @typescript-eslint/no-require-imports */
import { ScoresService } from '@app/database/score/score.service';
import { ScoreHandler } from '@app/services/score-handler/score-handler.service';
import { expect } from 'chai';
import Sinon = require('sinon');
const MOCK_SCORE = {
    name: ['NIKOLAY'],
    score: 500,
    playerMode: 'Classique',
};
const MOCK_SCORE_2 = { name: ['SATOSHI'], score: 500, playerMode: 'Classique' };
describe('Score Handler service', () => {
    let scoresHandlerService: ScoreHandler;
    let scoreServiceStub: Sinon.SinonStubbedInstance<ScoresService>;

    beforeEach(async () => {
        scoresHandlerService = new ScoreHandler(scoreServiceStub);
        scoreServiceStub = Sinon.createStubInstance(ScoresService);
    });

    it('should call deleteAllScores when resetScores is called', async () => {
        scoresHandlerService.resetScores();
        expect(scoreServiceStub.deleteAllScores.calledOnce);
    });

    it('should call addDummyScores when resetScores is called', async () => {
        scoresHandlerService.resetScores();
        expect(scoreServiceStub.addDummyScores.calledOnce);
    });

    it('should call addScore when the score is new', async () => {
        scoreServiceStub.getScoreByPlayerModeAndScore.resolves([]);
        scoresHandlerService.setScore(MOCK_SCORE);
        expect(scoreServiceStub.addScore.calledOnce);
    });

    it('should call updateScoreName when the name is not alredy in the same score', async () => {
        scoreServiceStub.getScoreByPlayerModeAndScore.resolves([MOCK_SCORE]);
        scoresHandlerService.setScore(MOCK_SCORE_2);
        expect(scoreServiceStub.updateScoreName.calledOnce);
    });
    it('should call updateScoreName when update throws and an error', async () => {
        scoreServiceStub.getScoreByPlayerModeAndScore.resolves([MOCK_SCORE]);
        scoreServiceStub.updateScoreName.rejects();
        scoresHandlerService.setScore(MOCK_SCORE_2);
        expect(scoreServiceStub.updateScoreName.calledOnce);
    });
    it('should not call updateScoreName', async () => {
        scoreServiceStub.getScoreByPlayerModeAndScore.resolves([MOCK_SCORE]);
        scoreServiceStub.updateScoreName.resolves();
        scoresHandlerService.setScore(MOCK_SCORE_2);
        expect(scoreServiceStub.updateScoreName.notCalled);
    });
    it('should not call updateScoreName when the name is in the names of the score', async () => {
        scoreServiceStub.getScoreByPlayerModeAndScore.resolves([MOCK_SCORE_2]);
        scoreServiceStub.updateScoreName.resolves();
        scoresHandlerService.setScore(MOCK_SCORE);
        expect(scoreServiceStub.updateScoreName.notCalled);
    });
});
