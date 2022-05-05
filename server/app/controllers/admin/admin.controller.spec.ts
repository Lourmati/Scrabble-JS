/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import { Application } from '@app/app';
import { MOCK_GAME_CLASSIQUE, MOCK_GAME_LOG2990 } from '@app/constants/game-history';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import * as chai from 'chai';
import * as fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import * as supertest from 'supertest';
import { Container } from 'typedi';

describe('AdminController', () => {
    let dictionaryServiceStub: SinonStubbedInstance<DictionaryService>;
    let virtualPlayerServiceStub: SinonStubbedInstance<VirtualPlayerService>;
    let gameHistoryServiceStub: SinonStubbedInstance<GameHistoryService>;
    let expressApp: Express.Application;

    beforeEach(async () => {
        dictionaryServiceStub = createStubInstance(DictionaryService);
        virtualPlayerServiceStub = createStubInstance(VirtualPlayerService);
        gameHistoryServiceStub = createStubInstance(GameHistoryService);
        const app = Container.get(Application);
        Object.defineProperty(app['adminController'], 'dictionaryService', { value: dictionaryServiceStub, writable: true });
        Object.defineProperty(app['adminController'], 'virtualPlayerService', { value: virtualPlayerServiceStub, writable: true });
        Object.defineProperty(app['adminController'], 'gameHistoryService', { value: gameHistoryServiceStub, writable: true });
        expressApp = app.app;
    });

    afterEach(() => {
        if (fs.existsSync('app/assets/dictionaries/test.json')) fs.unlinkSync('app/assets/dictionaries/test.json');
    });

    /**
     *
     *      Dictionnaires
     *
     */

    it('Should return dictionaries (GET)', async () => {
        dictionaryServiceStub.getDictionaries.returns([]);
        return supertest(expressApp)
            .get('/api/admin/dictionaries')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal([]);
            });
    });

    it('Should add dictionary (POST) (201)', async () => {
        const buffer = Buffer.from('some data');
        dictionaryServiceStub.addDictionary.returns(true);
        return supertest(expressApp)
            .post('/api/admin/dictionaries')
            .attach('dictionary', buffer, 'test.json')
            .expect(StatusCodes.CREATED)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should add dictionary (POST) (400)', async () => {
        const buffer = Buffer.from('some data');
        dictionaryServiceStub.addDictionary.returns(false);
        return supertest(expressApp)
            .post('/api/admin/dictionaries')
            .attach('dictionary', buffer, { filename: 'test.json', contentType: 'plain/text' })
            .expect(StatusCodes.BAD_REQUEST)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should add dictionary (POST) (400)', async () => {
        fs.writeFileSync('app/assets/dictionaries/test.json', '');
        const buffer = Buffer.from('some data');
        dictionaryServiceStub.addDictionary.returns(false);
        return supertest(expressApp)
            .post('/api/admin/dictionaries')
            .attach('dictionary', buffer, { filename: 'test.json', contentType: 'application/json' })
            .expect(StatusCodes.BAD_REQUEST)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should add dictionary (POST) (400)', async () => {
        dictionaryServiceStub.addDictionary.returns(false);
        return supertest(expressApp)
            .post('/api/admin/dictionaries')
            .expect(StatusCodes.BAD_REQUEST)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should delete dictionary (POST) (200)', async () => {
        dictionaryServiceStub.deleteDictionary.returns(true);
        return supertest(expressApp)
            .delete('/api/admin/dictionaries/0')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should delete dictionary (POST) (404)', async () => {
        dictionaryServiceStub.deleteDictionary.returns(false);
        return supertest(expressApp)
            .delete('/api/admin/dictionaries/0')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should edit dictionary (POST) (200)', async () => {
        dictionaryServiceStub.updateDictionary.returns(true);
        return supertest(expressApp)
            .patch('/api/admin/dictionaries')
            .field('filename', 'test.json')
            .field('title', 'title')
            .field('description', 'description')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should edit dictionary (POST) (404)', async () => {
        dictionaryServiceStub.updateDictionary.returns(false);
        return supertest(expressApp)
            .patch('/api/admin/dictionaries')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should reset dictionary (DELETE) (200)', async () => {
        dictionaryServiceStub.resetDictionaries.returns(true);
        return supertest(expressApp)
            .delete('/api/admin/dictionaries/reset')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should reset dictionary (DELETE) (404)', async () => {
        dictionaryServiceStub.resetDictionaries.returns(false);
        return supertest(expressApp)
            .delete('/api/admin/dictionaries/reset')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    /**
     *
     *      Noms des joueurs virtuels
     *
     */

    it('Should return names (GET)', async () => {
        virtualPlayerServiceStub.getVirtualPlayerNames.resolves({ beginner: [], expert: [] });
        return supertest(expressApp)
            .get('/api/admin/names')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({ beginner: [], expert: [] });
            });
    });

    it('Should add name (POST) (201)', async () => {
        virtualPlayerServiceStub.addName.resolves(true);
        return supertest(expressApp)
            .post('/api/admin/names')
            .field('name', 'name')
            .field('level', '0')
            .expect(StatusCodes.CREATED)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should add name (POST) (400)', async () => {
        virtualPlayerServiceStub.addName.resolves(false);
        return supertest(expressApp)
            .post('/api/admin/names')
            .field('name', 'name')
            .field('level', '0')
            .expect(StatusCodes.BAD_REQUEST)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should delete name (POST) (200)', async () => {
        virtualPlayerServiceStub.deleteName.resolves(true);
        return supertest(expressApp)
            .delete('/api/admin/names/0/0')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should delete name (POST) (404)', async () => {
        virtualPlayerServiceStub.deleteName.resolves(false);
        return supertest(expressApp)
            .delete('/api/admin/names/0/0')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should edit name (POST) (200)', async () => {
        virtualPlayerServiceStub.editName.resolves(true);
        return supertest(expressApp)
            .patch('/api/admin/names')
            .field('index', '0')
            .field('newName', 'newName')
            .field('level', '0')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should edit name (POST) (404)', async () => {
        virtualPlayerServiceStub.editName.resolves(false);
        return supertest(expressApp)
            .patch('/api/admin/names')
            .field('index', '0')
            .field('newName', 'newName')
            .field('level', '0')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should reset names (DELETE) (200)', async () => {
        virtualPlayerServiceStub.resetNames.resolves(true);
        return supertest(expressApp)
            .delete('/api/admin/names/reset')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should reset names (DELETE) (404)', async () => {
        virtualPlayerServiceStub.resetNames.resolves(false);
        return supertest(expressApp)
            .delete('/api/admin/names/reset')
            .expect(StatusCodes.NOT_FOUND)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    /**
     *
     *      Historique des parties
     *
     */

    it('Should return game history from gameHistoryService service on valid get request gameHistory (200)', async () => {
        const MOCK_GAME_ARRAY = [MOCK_GAME_LOG2990, MOCK_GAME_CLASSIQUE];
        gameHistoryServiceStub.getAllGameHistory.resolves(MOCK_GAME_ARRAY);
        return supertest(expressApp)
            .get('/api/admin/game-history')
            .expect(StatusCodes.OK)
            .then((response) => {
                for (let i = 0; i < MOCK_GAME_ARRAY.length; i++) {
                    const actualDate = new Date(response.body[i].start);
                    chai.expect(actualDate).to.deep.equal(MOCK_GAME_ARRAY[i].start);
                    chai.expect(response.body[i].duration).to.deep.equal(MOCK_GAME_ARRAY[i].duration);
                    chai.expect(response.body[i].players).to.deep.equal(MOCK_GAME_ARRAY[i].players);
                    chai.expect(response.body[i].gameMode).to.deep.equal(MOCK_GAME_ARRAY[i].gameMode);
                }
            });
    });

    it('Should return game history from gameHistoryService service on invalid get request gameHistory (404)', async () => {
        gameHistoryServiceStub.getAllGameHistory.rejects(new Error('Error'));
        return supertest(expressApp)
            .get('/api/admin/game-history')
            .expect(StatusCodes.NOT_FOUND)
            .catch((error) => {
                chai.expect(error.message).to.equal('Error');
            });
    });

    it('Should return an error as a message on service fail for gameHistory (404)', async () => {
        gameHistoryServiceStub.deleteAllGameHistory.resolves();
        return supertest(expressApp)
            .delete('/api/admin/game-history')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should return an error as a message on service fail for gameHistory (404)', async () => {
        gameHistoryServiceStub.deleteAllGameHistory.rejects(new Error('Error'));
        return supertest(expressApp)
            .delete('/api/admin/game-history')
            .expect(StatusCodes.NOT_FOUND)
            .catch((error) => {
                chai.expect(error.message).to.equal('Error');
            });
    });

    it('Should return an error as a message on service fail for gameHistory (404)', async () => {
        gameHistoryServiceStub.deleteGameHistory.resolves();
        return supertest(expressApp)
            .delete('/api/admin/game-history/1')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should return an error as a message on service fail for gameHistory (404)', async () => {
        gameHistoryServiceStub.deleteGameHistory.rejects(new Error('Error'));
        return supertest(expressApp)
            .delete('/api/admin/game-history/1')
            .expect(StatusCodes.NOT_FOUND)
            .catch((error) => {
                chai.expect(error.message).to.equal('Error');
            });
    });

    it('Should populate DB', async () => {
        return supertest(expressApp)
            .get('/api/admin/populate')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });

    it('Should populate DB 2', async () => {
        return supertest(expressApp)
            .get('/api/admin/populate2')
            .expect(StatusCodes.OK)
            .then((response) => {
                chai.expect(response.body).to.deep.equal({});
            });
    });
});
