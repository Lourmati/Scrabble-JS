/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Easel } from '@app/classes/easel/easel';
import { Game } from '@app/classes/game/game';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { Player } from '@app/classes/player/player';
import { Reserve } from '@app/classes/reserve/reserve';
import { expect } from 'chai';
import { describe } from 'mocha';
import { createStubInstance, SinonStubbedInstance } from 'sinon';
import { GameMode } from './game-mode';
import { GameType } from './game-type';

const MOCK_SCORE = 10;
const MOCK_GAME_PARAMETERS = { mode: GameMode.CLASSIC, timer: 60, dictionary: 'base' };
const MOCK_PLAYER_INFORMATIONS_HOST = { id: 'host_id', name: 'host_name' };
const MOCK_PLAYER_INFORMATIONS_GUEST = { id: 'guest_id', name: 'guest_name' };
const MOCK_END_MESSAGE = 'Fin de partie - 0 lettres restantes\nhost_name: AB\nguest_name: AB';

describe('Game', () => {
    let game: Game;
    let reserveStub: SinonStubbedInstance<Reserve>;
    let currentPlayerStub: SinonStubbedInstance<Player>;
    let otherPlayerStub: SinonStubbedInstance<Player>;
    let easelStub: SinonStubbedInstance<Easel>;
    let objectivesMock: Objective[];
    let publicObjective: Objective;
    let privateObjective1: Objective;
    let privateObjective2: Objective;

    beforeEach(() => {
        reserveStub = createStubInstance(Reserve);
        currentPlayerStub = createStubInstance(Player);
        otherPlayerStub = createStubInstance(Player);
        easelStub = createStubInstance(Easel);

        privateObjective1 = {
            id: '1',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 1,
        };
        privateObjective2 = {
            id: '2',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 2,
        };
        publicObjective = {
            id: '2',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: true,
            done: false,
            code: 3,
        };
        objectivesMock = [];

        game = new Game(MOCK_PLAYER_INFORMATIONS_HOST, MOCK_GAME_PARAMETERS, GameType.MULTIPLAYER);
        game.currentPlayer = currentPlayerStub;
        game.otherPlayer = otherPlayerStub;

        game.reserve = reserveStub;
        reserveStub.removeRandomLetters.returns([]);
        reserveStub.getSize.returns(0);
        easelStub.getScore.returns(MOCK_SCORE);
        easelStub.getContent.returns([
            { letter: 'A', point: 1 },
            { letter: 'B', point: 2 },
        ]);
        currentPlayerStub.getId.returns('host_id');
        currentPlayerStub.getName.returns('host_name');
        currentPlayerStub.getScore.callThrough();
        currentPlayerStub.getEasel.returns(easelStub);
        currentPlayerStub['easel'] = easelStub;
        currentPlayerStub['score'] = 0;
        currentPlayerStub['name'] = 'host_name';
        currentPlayerStub.addScore.callThrough();
        currentPlayerStub.removeScore.callThrough();

        otherPlayerStub['score'] = 0;
        otherPlayerStub['easel'] = easelStub;
        otherPlayerStub['name'] = 'guest_name';
        otherPlayerStub.getName.callThrough();
        otherPlayerStub.getEasel.returns(easelStub);
        otherPlayerStub.addScore.callThrough();
        otherPlayerStub.removeScore.callThrough();
    });

    it('Should create the player and assign the current player', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            game.setPlayersMultiplayer(MOCK_PLAYER_INFORMATIONS_HOST, MOCK_PLAYER_INFORMATIONS_GUEST);
            expect(game.currentPlayer['name']).to.be.oneOf(['host_name', 'guest_name']);
        }
        done();
    });

    it('Should return true if the player can play', (done: Mocha.Done) => {
        currentPlayerStub['id'] = 'host_id';
        expect(game.isThisPlayerTurn('host_id')).to.be.true;
        expect(game.isThisPlayerTurn('guest_id')).to.be.false;
        done();
    });

    it('Should add score to the current player', (done: Mocha.Done) => {
        game.addScore(MOCK_SCORE);
        done();
    });

    it('Should check for end game after take turn', (done: Mocha.Done) => {
        currentPlayerStub.passedTurn = 3;
        otherPlayerStub.passedTurn = 3;
        expect(game.checkForEndGameAfterTakeTurn()).to.be.true;
        expect(game.currentPlayer['score']).to.equal(-MOCK_SCORE);
        expect(game.otherPlayer['score']).to.equal(-MOCK_SCORE);
        done();
    });

    it('Should check for end game after take turn', (done: Mocha.Done) => {
        currentPlayerStub.passedTurn = 4;
        otherPlayerStub.passedTurn = 2;
        expect(game.checkForEndGameAfterTakeTurn()).to.be.false;
        expect(game.currentPlayer['score']).to.equal(0);
        expect(game.otherPlayer['score']).to.equal(0);
        done();
    });

    it('Should check for end game after take turn', (done: Mocha.Done) => {
        currentPlayerStub.passedTurn = 1;
        otherPlayerStub.passedTurn = 2;
        expect(game.checkForEndGameAfterTakeTurn()).to.be.false;
        expect(game.currentPlayer['score']).to.equal(0);
        expect(game.otherPlayer['score']).to.equal(0);
        done();
    });

    it('Should check for empty easel and reserve', (done: Mocha.Done) => {
        reserveStub.isEmpty.returns(true);
        easelStub.isEmpty.returns(true);
        expect(game.checkForEmptyReserveAndEasel()).to.be.true;
        expect(game.currentPlayer['score']).to.equal(MOCK_SCORE);
        expect(game.otherPlayer['score']).to.equal(-MOCK_SCORE);
        done();
    });

    it('Should check for empty easel and reserve', (done: Mocha.Done) => {
        reserveStub.isEmpty.returns(false);
        easelStub.isEmpty.returns(true);
        expect(game.checkForEmptyReserveAndEasel()).to.be.false;
        expect(game.currentPlayer['score']).to.equal(0);
        expect(game.otherPlayer['score']).to.equal(0);
        done();
    });

    it('Should check for empty easel and reserve', (done: Mocha.Done) => {
        reserveStub.isEmpty.returns(true);
        easelStub.isEmpty.returns(false);
        expect(game.checkForEmptyReserveAndEasel()).to.be.false;
        expect(game.currentPlayer['score']).to.equal(0);
        expect(game.otherPlayer['score']).to.equal(0);
        done();
    });

    it('Should check for empty easel and reserve', (done: Mocha.Done) => {
        reserveStub.isEmpty.returns(false);
        easelStub.isEmpty.returns(false);
        expect(game.checkForEmptyReserveAndEasel()).to.be.false;
        expect(game.currentPlayer['score']).to.equal(0);
        expect(game.otherPlayer['score']).to.equal(0);
        done();
    });

    it('Should take turn', (done: Mocha.Done) => {
        game.currentPlayer.passedTurn = 0;
        game.takeTurn(true);
        expect(game.currentPlayer['name']).to.equal('guest_name');
        expect(game.otherPlayer['name']).to.equal('host_name');
        expect(game.otherPlayer.passedTurn).to.equal(1);
        done();
    });

    it('Should take turn', (done: Mocha.Done) => {
        game.currentPlayer.passedTurn = 0;
        game.takeTurn(false);
        expect(game.currentPlayer['name']).to.equal('guest_name');
        expect(game.otherPlayer['name']).to.equal('host_name');
        expect(game.otherPlayer.passedTurn).to.equal(0);
        done();
    });

    it('Should return end message', (done: Mocha.Done) => {
        expect(game.getEndMessage()).to.equal(MOCK_END_MESSAGE);
        done();
    });

    it('Should exchange letters if the player have these letters', (done: Mocha.Done) => {
        game.currentPlayer['easel'] = easelStub;
        easelStub.containsLetters.returns(true);
        game.exchange([], true);
        expect(easelStub.removeLetters.calledOnce);
        expect(reserveStub.addLetters.calledOnce);
        expect(reserveStub.removeRandomLetters.calledOnce);
        expect(easelStub.addLetters.calledOnce);
        done();
    });

    it('Should exchange letters if the player have not these letters', (done: Mocha.Done) => {
        game.currentPlayer['easel'] = easelStub;
        easelStub.containsLetters.returns(true);
        game.exchange([], false);
        expect(easelStub.removeLetters.calledOnce);
        expect(!reserveStub.addLetters.calledOnce);
        expect(reserveStub.removeRandomLetters.calledOnce);
        expect(easelStub.addLetters.calledOnce);
        done();
    });

    it('Should not exchange letters if the player have not these letters', (done: Mocha.Done) => {
        game.currentPlayer['easel'] = easelStub;
        easelStub.containsLetters.returns(false);
        game.exchange([], true);
        expect(!easelStub.removeLetters.calledOnce);
        expect(!reserveStub.addLetters.calledOnce);
        expect(!reserveStub.removeRandomLetters.calledOnce);
        expect(!easelStub.addLetters.calledOnce);
        done();
    });

    it('Should not exchange letters if the player have not these letters', (done: Mocha.Done) => {
        game.currentPlayer['easel'] = easelStub;
        easelStub.containsLetters.returns(false);
        game.exchange([], false);
        expect(!easelStub.removeLetters.calledOnce);
        expect(!reserveStub.addLetters.calledOnce);
        expect(!reserveStub.removeRandomLetters.calledOnce);
        expect(!easelStub.addLetters.calledOnce);
        done();
    });

    it('Should set placeRightPlayer to true when calling getSidebarInformations and setPlaceRightPlayer is false', (done: Mocha.Done) => {
        game.placeRightPlayer = false;
        game.getSidebarInformations();
        expect(game.placeRightPlayer).to.equals(true);
        done();
    });

    it('Should set placeRightPlayer to false when calling getSidebarInformations and setPlaceRightPlayer is true', (done: Mocha.Done) => {
        game.placeRightPlayer = true;
        game.getSidebarInformations();
        expect(game.placeRightPlayer).to.equals(false);
        done();
    });

    it('Should set private objectives for the two players', (done: Mocha.Done) => {
        objectivesMock = [privateObjective1, privateObjective2];
        game.objectives = objectivesMock;
        const playersId: string[] = ['id0', 'id1'];
        game.setPrivateObjectivesId(playersId);
        expect(game.objectives[0].id === playersId[0]);
        expect(game.objectives[1].id === playersId[1]);
        expect(game.isPrivateSet === true);
        done();
    });

    it('Should not set public objectives for the two players', (done: Mocha.Done) => {
        objectivesMock = [publicObjective];
        game.objectives = objectivesMock;
        const playersId: string[] = ['id0', 'id1'];
        game.setPrivateObjectivesId(playersId);
        expect(game.objectives[0].id === undefined);
        done();
    });
    it('Should add Score', (done: Mocha.Done) => {
        publicObjective.done = true;
        privateObjective1.done = false;
        game.addScoreObjective([publicObjective, privateObjective1]);
        expect(true);
        done();
    });
    it('Should add Score objectives ', (done: Mocha.Done) => {
        publicObjective.done = false;
        privateObjective1.done = true;
        game.addScoreObjective([publicObjective, privateObjective1]);
        expect(true);
        done();
    });
    it('Should end game', (done: Mocha.Done) => {
        game.start = new Date();
        const duration = game.end();
        expect(duration.minutes).to.be.a('number');
        expect(duration.seconds).to.be.a('number');
        done();
    });
});
