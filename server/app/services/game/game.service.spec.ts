/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
import Sinon = require('sinon');
import { Easel } from '@app/classes/easel/easel';
import { Game } from '@app/classes/game/game';
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { GameType } from '@app/classes/game/game-type';
import { AXIS } from '@app/classes/grid/axis';
import { Box } from '@app/classes/grid/box';
import { GridServer } from '@app/classes/grid/grid';
import { Placement } from '@app/classes/grid/placement';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { Player } from '@app/classes/player/player';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { Reserve } from '@app/classes/reserve/reserve';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { VirtualPlayerCommand } from '@app/classes/virtual-player/virtual-player-commands';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { MAX_THRESHOLD_MS, MIN_THRESHOLD_MS } from '@app/constants/virtual-player';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { UpdateService } from '@app/services//update/update.service';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { GameService } from '@app/services/game/game.service';
import { ObjectivesManagerService } from '@app/services/objectives-manager/objectives-manager.service';
import { PlacementGeneratorService } from '@app/services/placement-generator/placement-generator.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { PlacementValidationService } from '@app/services/placement-validation/placement-validation.service';
import { ScoreHandler } from '@app/services/score-handler/score-handler.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { expect } from 'chai';
import sinon = require('sinon');

const MOCK_GAME_ID = 'game_id';
const MOCK_PLAYER_ID = 'player_id';
const MOCK_PLAYER_NAME = 'player_name';
const MOCK_PLAYER_INFORMATIONS: PlayerInformations = {
    id: MOCK_PLAYER_ID,
    name: MOCK_PLAYER_NAME,
};
const MOCK_GAME_PARAMETERS: GameParameters = { mode: GameMode.CLASSIC, timer: 0, dictionary: '' };
const MOCK_PLACEMENT = {
    position: { x: 0, y: 0 },
    axis: AXIS.HORIZONTAL,
    letters: [{ letter: 'A', point: 1 }],
};

describe('GameService', () => {
    let socketCommunicationServiceStub: Sinon.SinonStubbedInstance<SocketCommunicationService>;
    let placementValidationServiceStub: Sinon.SinonStubbedInstance<PlacementValidationService>;
    let placementGeneratorServiceStub: Sinon.SinonStubbedInstance<PlacementGeneratorService>;
    let placementServiceStub: Sinon.SinonStubbedInstance<PlacementService>;
    let updateServiceStub: Sinon.SinonStubbedInstance<UpdateService>;
    let virtualPlayerServiceStub: Sinon.SinonStubbedInstance<VirtualPlayerService>;
    let highScoresServiceStub: Sinon.SinonStubbedInstance<ScoreHandler>;
    let objectiveServiceStub: Sinon.SinonStubbedInstance<ObjectivesManagerService>;
    let gameHistoryServiceStub: Sinon.SinonStubbedInstance<GameHistoryService>;
    let dictionaryServiceStub: Sinon.SinonStubbedInstance<DictionaryService>;
    let gameService: GameService;

    let gameStub: Sinon.SinonStubbedInstance<Game>;
    let playerStub: Sinon.SinonStubbedInstance<Player>;
    let gridStub: Sinon.SinonStubbedInstance<GridServer>;
    let easelStub: Sinon.SinonStubbedInstance<Easel>;
    let reserveStub: Sinon.SinonStubbedInstance<Reserve>;
    let objectivesMock: Objective[];
    let objective1: Objective;
    let objective2: Objective;

    let virtualPlayerStub: Sinon.SinonStubbedInstance<VirtualPlayer>;

    beforeEach(() => {
        objectiveServiceStub = Sinon.createStubInstance(ObjectivesManagerService);
        highScoresServiceStub = Sinon.createStubInstance(ScoreHandler);
        socketCommunicationServiceStub = Sinon.createStubInstance(SocketCommunicationService);
        placementValidationServiceStub = Sinon.createStubInstance(PlacementValidationService);
        placementGeneratorServiceStub = Sinon.createStubInstance(PlacementGeneratorService);
        placementServiceStub = Sinon.createStubInstance(PlacementService);
        updateServiceStub = Sinon.createStubInstance(UpdateService);
        virtualPlayerServiceStub = Sinon.createStubInstance(VirtualPlayerService);
        gameHistoryServiceStub = Sinon.createStubInstance(GameHistoryService);
        dictionaryServiceStub = Sinon.createStubInstance(DictionaryService);
        virtualPlayerServiceStub.createMessage.returns({
            gameId: MOCK_GAME_ID,
            playerId: MOCK_PLAYER_ID,
            playerName: MOCK_PLAYER_NAME,
            content: '',
        });

        placementServiceStub.placeLetters.returns({ boxes: [], lettersPlaced: [] });
        placementGeneratorServiceStub.generatePlacements.returns([]);

        gameService = new GameService(
            socketCommunicationServiceStub,
            placementValidationServiceStub,
            placementGeneratorServiceStub,
            placementServiceStub,
            virtualPlayerServiceStub,
            updateServiceStub,
            highScoresServiceStub,
            objectiveServiceStub,
            gameHistoryServiceStub,
            dictionaryServiceStub,
        );

        objective1 = {
            id: '1',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 1,
        };
        objective2 = {
            id: '2',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 2,
        };

        objectivesMock = [objective1, objective2];

        objectiveServiceStub.getGameObjectives.returns(objectivesMock);

        gameStub = Sinon.createStubInstance(Game);
        gameStub.parameters = MOCK_GAME_PARAMETERS;
        playerStub = Sinon.createStubInstance(Player);
        gridStub = Sinon.createStubInstance(GridServer);
        easelStub = Sinon.createStubInstance(Easel);
        reserveStub = Sinon.createStubInstance(Reserve);

        playerStub['id'] = MOCK_PLAYER_ID;
        playerStub['name'] = MOCK_PLAYER_NAME;
        playerStub.getScore.callThrough();
        playerStub['score'] = 0;
        playerStub.getEasel.returns(easelStub);
        easelStub.getContent.returns([{ letter: 'A', point: 1 }]);
        easelStub.getSize.returns(0);
        reserveStub.getSize.returns(0);
        gameStub.allPlacedWords = ['bonjour'];
        gridStub.boxes = [];
        for (let i = 0; i < 16; i++) {
            gridStub.boxes[i] = new Array(16);
            for (let j = 0; j < 16; j++) {
                gridStub.boxes[i][j] = { value: '' } as Box;
            }
        }

        playerStub['easel'] = easelStub;
        gameStub.id = MOCK_GAME_ID;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = playerStub;
        gameStub.reserve = reserveStub;
        gameStub.grid = gridStub;
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.takeTurn.callThrough();
        gameService['games'].set(MOCK_GAME_ID, gameStub);

        virtualPlayerStub = Sinon.createStubInstance(VirtualPlayer);
        virtualPlayerStub.getEasel.returns(easelStub);
        virtualPlayerStub.getExchange.returns({ letters: [] });
        virtualPlayerStub.getName.returns('');
        virtualPlayerStub.getScore.returns(0);
    });

    it('Should create multiplayer game', (done: Mocha.Done) => {
        gameService['games'] = new Map();
        gameService.createMultiplayerGame(MOCK_GAME_PARAMETERS, MOCK_PLAYER_INFORMATIONS, MOCK_PLAYER_INFORMATIONS);
        expect(gameService['games'].size).to.equal(1);
        expect(gameStub.setPlayersMultiplayer.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        done();
    });

    it('Should create multiplayer game in LOG2990 mode', (done: Mocha.Done) => {
        MOCK_GAME_PARAMETERS.mode = GameMode.LOG2990;
        gameService.createMultiplayerGame(MOCK_GAME_PARAMETERS, MOCK_PLAYER_INFORMATIONS, MOCK_PLAYER_INFORMATIONS);
        expect(gameStub.setObjectives.calledOnce);
        done();
    });
    it('Should create multiplayer game in LOG2990 mode', (done: Mocha.Done) => {
        MOCK_GAME_PARAMETERS.mode = GameMode.CLASSIC;
        gameService.createMultiplayerGame(MOCK_GAME_PARAMETERS, MOCK_PLAYER_INFORMATIONS, MOCK_PLAYER_INFORMATIONS);
        expect(!gameStub.setObjectives.calledOnce);
        done();
    });
    it('Should create solo game', (done: Mocha.Done) => {
        MOCK_GAME_PARAMETERS.mode = GameMode.LOG2990;
        gameService.createSoloGame(MOCK_PLAYER_INFORMATIONS, MOCK_GAME_PARAMETERS, VirtualPlayerLevel.BEGINNER);
        done();
    });
    it('Should create solo game', (done: Mocha.Done) => {
        MOCK_GAME_PARAMETERS.mode = GameMode.CLASSIC;
        gameService.createSoloGame(MOCK_PLAYER_INFORMATIONS, MOCK_GAME_PARAMETERS, VirtualPlayerLevel.BEGINNER);
        done();
    });

    it('Should handle place command - 1', (done: Mocha.Done) => {
        expect(gameService.place('BAD_ID', MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.false;
        done();
    });

    it('Should handle place command - 2', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(false);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.false;
        done();
    });

    it('Should handle place command - 2', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        playerStub.haveLetters.returns(false);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.false;
        done();
    });

    it('Should handle place command - 3', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = true;
        gameStub.checkForEmptyReserveAndEasel.returns(true);
        playerStub.haveLetters.returns(true);
        const stub = Sinon.stub(gameService, 'placeLetters' as keyof GameService).returns(true);
        const spy = Sinon.spy(gameService, 'handleEndGame');
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(spy.calledOnce);
        expect(stub.calledOnce);
        done();
    });

    it('Should handle place command - 4', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = true;
        gameStub.checkForEmptyReserveAndEasel.returns(false);
        playerStub.haveLetters.returns(true);
        const takeTurnSpy = Sinon.spy(gameService, 'takeTurn');
        const stub = Sinon.stub(gameService, 'placeLetters' as keyof GameService).returns(true);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(stub.calledOnce);
        expect(takeTurnSpy.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        done();
    });

    it('Should handle place command - 5', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = false;
        gameStub.checkForEmptyReserveAndEasel.returns(true);
        playerStub.haveLetters.returns(true);
        const spy = Sinon.spy(gameService, 'handleEndGame');
        placementValidationServiceStub.isPlacementValid.returns({
            validity: true,
            score: 0,
            placedWords: [],
        });
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(spy.calledOnce);
        done();
    });

    it('Should handle place command - 5', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = false;
        gameStub.checkForEmptyReserveAndEasel.returns(true);
        playerStub.haveLetters.returns(true);
        const spy = Sinon.spy(gameService, 'handleEndGame');
        placementValidationServiceStub.isPlacementValid.returns({
            validity: true,
            score: 0,
            placedWords: [],
        });
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, { ...MOCK_PLACEMENT, axis: AXIS.VERTICAL })).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(spy.calledOnce);
        done();
    });

    it('Should handle place command - 7', (done: Mocha.Done) => {
        gameStub.otherPlayer = virtualPlayerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = true;
        gameStub.checkForEmptyReserveAndEasel.returns(false);
        playerStub.haveLetters.returns(true);
        const takeTurnSpy = Sinon.spy(gameService, 'takeTurn');
        const virtualPlayerActionSpy = Sinon.stub(gameService, 'virtualPlayerAction');
        const stub = Sinon.stub(gameService, 'placeLetters' as keyof GameService).returns(true);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(takeTurnSpy.calledOnce);
        expect(stub.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle place command - 7', (done: Mocha.Done) => {
        gameStub.otherPlayer = playerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = true;
        gameStub.checkForEmptyReserveAndEasel.returns(false);
        playerStub.haveLetters.returns(true);
        const takeTurnSpy = Sinon.spy(gameService, 'takeTurn');
        const virtualPlayerActionSpy = Sinon.stub(gameService, 'virtualPlayerAction');
        const stub = Sinon.stub(gameService, 'placeLetters' as keyof GameService).returns(true);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.true;
        expect(gameStub.addScore.calledOnce);
        expect(gameStub.exchange.calledOnce);
        expect(takeTurnSpy.calledOnce);
        expect(stub.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(!virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle place command - 6', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.isGridEmpty = false;
        playerStub.haveLetters.returns(true);
        const stub = Sinon.stub(gameService, 'placeLetters' as keyof GameService).returns(false);
        expect(stub.calledOnce);
        expect(gameService.place(MOCK_GAME_ID, MOCK_PLAYER_ID, MOCK_PLACEMENT)).to.be.false;
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        expect(gameService.exchange('BAD_ID', MOCK_PLAYER_ID, { letters: [] })).to.be.false;
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(false);
        expect(gameService.exchange(MOCK_GAME_ID, MOCK_PLAYER_ID, { letters: [] })).to.be.false;
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        reserveStub.getSize.returns(0);
        expect(gameService.exchange(MOCK_GAME_ID, MOCK_PLAYER_ID, { letters: [] })).to.be.false;
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        reserveStub.getSize.returns(7);
        expect(gameService.exchange(MOCK_GAME_ID, MOCK_PLAYER_ID, { letters: [] })).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        gameStub.otherPlayer = virtualPlayerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        reserveStub.getSize.returns(7);
        const virtualPlayerActionSpy = Sinon.spy(gameService, 'virtualPlayerAction');
        expect(gameService.exchange(MOCK_GAME_ID, MOCK_PLAYER_ID, { letters: [] })).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle exchange command', (done: Mocha.Done) => {
        gameStub.otherPlayer = playerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        reserveStub.getSize.returns(7);
        const virtualPlayerActionSpy = Sinon.spy(gameService, 'virtualPlayerAction');
        expect(gameService.exchange(MOCK_GAME_ID, MOCK_PLAYER_ID, { letters: [] })).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(!virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        expect(gameService.takeTurn('BAD_ID', MOCK_PLAYER_ID)).to.be.false;
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(false);
        expect(gameService.takeTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.false;
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.checkForEndGameAfterTakeTurn.returns(true);
        const spy = Sinon.spy(gameService, 'handleEndGame');
        expect(gameService.takeTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(spy.calledOnce);
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.checkForEndGameAfterTakeTurn.returns(false);
        expect(gameService.takeTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        gameStub.otherPlayer = virtualPlayerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.checkForEndGameAfterTakeTurn.returns(false);
        const virtualPlayerActionSpy = Sinon.spy(gameService, 'virtualPlayerAction');
        expect(gameService.takeTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle take turn command', (done: Mocha.Done) => {
        gameStub.otherPlayer = playerStub;
        gameStub.type = GameType.SOLO;
        gameStub.isThisPlayerTurn.returns(true);
        gameStub.checkForEndGameAfterTakeTurn.returns(false);
        const virtualPlayerActionSpy = Sinon.spy(gameService, 'virtualPlayerAction');
        expect(gameService.takeTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.true;
        expect(gameStub.takeTurn.calledOnce);
        expect(updateServiceStub.updateClient.calledOnce);
        expect(!virtualPlayerActionSpy.calledOnce);
        done();
    });

    it('Should handle reserve command', (done: Mocha.Done) => {
        reserveStub.getFormattedContent.returns('FORMATTED');
        expect(gameService.reserve(MOCK_GAME_ID)).to.equal('FORMATTED');
        done();
    });

    it('Should handle reserve command', (done: Mocha.Done) => {
        expect(gameService.reserve('BAD_ID')).to.equal('');
        done();
    });

    it('Should handle hints command', (done: Mocha.Done) => {
        expect(gameService.hints('BAD_ID', MOCK_PLAYER_ID)).to.equal('');
        done();
    });

    it('Should handle hints command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(false);
        expect(gameService.hints(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.equal('');
        done();
    });

    it('Should handle hints command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        expect(gameService.hints(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.equal('');
        done();
    });

    it('Should handle hints command', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        placementGeneratorServiceStub.generatePlacements.returns([
            {
                position: { x: 1, y: 1 },
                axis: AXIS.HORIZONTAL,
                letters: 'letters',
            },
        ]);
        expect(gameService.hints(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.equal('!placer a1h letters');
        done();
    });

    it('Should handle end game', (done: Mocha.Done) => {
        gameStub.getEndMessage.returns('');
        gameService.handleEndGame(gameStub);
        expect(socketCommunicationServiceStub.emitToRoom.calledTwice);
        expect(gameService['games'].size).to.equal(0);
        done();
    });

    it('Should tell if this player can play (his turn)', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(true);
        expect(gameService.isThisPlayerTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.true;
        done();
    });

    it('Should tell if this player can play (his turn)', (done: Mocha.Done) => {
        gameStub.isThisPlayerTurn.returns(false);
        expect(gameService.isThisPlayerTurn(MOCK_GAME_ID, MOCK_PLAYER_ID)).to.be.false;
        done();
    });

    it('Should tell if this player can play (his turn)', (done: Mocha.Done) => {
        expect(gameService.isThisPlayerTurn('BAD_ID', MOCK_PLAYER_ID)).to.be.false;
        done();
    });

    it('Should handle surrender', () => {
        gameStub.type = GameType.SOLO;
        gameService.surrender(MOCK_GAME_ID, MOCK_PLAYER_ID);
        const spy = Sinon.spy(gameService['games'], 'delete');
        expect(spy.calledWith(MOCK_GAME_ID));
    });

    it('Should handle surrender', () => {
        gameService.surrender('BAD_ID', MOCK_PLAYER_ID);
        expect(!gameStub.isThisPlayerTurn.calledOnce);
    });

    it('Should handle surrender', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.isThisPlayerTurn.returns(false);
        gameService.surrender(MOCK_GAME_ID, MOCK_PLAYER_ID);
        expect(gameStub.otherPlayer.getId()).not.equal(MOCK_PLAYER_ID);
    });

    it('Should handle surrender', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.isThisPlayerTurn.returns(true);
        gameService.surrender(MOCK_GAME_ID, MOCK_PLAYER_ID);
        expect(gameStub.otherPlayer.getId()).not.equal(MOCK_PLAYER_ID);
    });

    /**
     * Tests liés au joueur virtuel
     */
    const MOCK_SCORE_CONSTRAINTS = { minScore: 0, maxScore: 0 };
    it('Should take turn when the VP choose to take turn', () => {
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.TAKETURN);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const spy = sinon.spy(gameService, 'takeTurn');
        gameService.virtualPlayerAction(gameStub);
        expect(spy.calledOnce);
    });

    it('Should exchange when the VP choose to take turn', () => {
        const stub = sinon.stub(gameService, 'takeTurn').returns(true);
        gameService['virtualPlayerTakeTurn'](gameStub);
        expect(stub.calledOnce);
    });

    it('Should exchange when the VP choose to exchange', () => {
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.EXCHANGE);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const stub = sinon.stub(gameService, 'exchange').returns(true);
        gameService.virtualPlayerAction(gameStub);
        expect(stub.calledOnce);
    });

    it('Should exchange when the VP choose to exchange', () => {
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.EXCHANGE);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const stub = sinon.stub(gameService, 'exchange').returns(false);
        const spy = sinon.spy(gameService, 'takeTurn');
        gameService.virtualPlayerAction(gameStub);
        expect(stub.calledOnce);
        expect(spy.calledOnce);
    });

    it('Should exchange when the VP choose to exchange', () => {
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.EXCHANGE);
        gameStub['currentPlayer'] = virtualPlayerStub;
        virtualPlayerStub.getExchange.returns({ letters: [{ letter: 'a', point: 1 }] });
        const stub = sinon.stub(gameService, 'exchange').returns(true);
        gameService.virtualPlayerAction(gameStub);
        expect(stub.calledOnce);
    });

    it('Should exchange when the VP choose to exchange', () => {
        gameStub['currentPlayer'] = virtualPlayerStub;
        virtualPlayerStub.getExchange.returns({ letters: [{ letter: 'a', point: 1 }] });
        const stub = sinon.stub(gameService, 'exchange').returns(true);
        gameService['virtualPlayerExchange'](gameStub);
        expect(stub.calledOnce);
    });

    it('Should place when the VP choose to place', () => {
        virtualPlayerServiceStub.getPlacements.returns(Promise.resolve([undefined] as unknown as Placement[]));
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.PLACE);
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const spy = sinon.spy(gameService, 'takeTurn');
        gameService.virtualPlayerAction(gameStub);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(spy.calledOnce);
    });

    it('Should place when the VP choose to place', () => {
        virtualPlayerServiceStub.getPlacements.returns(
            Promise.resolve([
                {
                    position: { x: 0, y: 0 },
                    axis: AXIS.HORIZONTAL,
                    letters: 'ABC',
                },
            ]),
        );
        const placeStub = sinon.stub(gameService, 'place').returns(false);
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.PLACE);
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const takeTurnSpy = sinon.spy(gameService, 'takeTurn');
        gameService.virtualPlayerAction(gameStub);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(placeStub.calledOnce);
        expect(!takeTurnSpy.calledOnce);
    });

    it('Should place when the VP choose to place', () => {
        virtualPlayerServiceStub.getPlacements.returns(
            Promise.resolve([
                {
                    position: { x: 0, y: 0 },
                    axis: AXIS.HORIZONTAL,
                    letters: 'ABC',
                },
            ]),
        );
        const placeStub = sinon.stub(gameService, 'place').returns(true);
        virtualPlayerStub.getCommand.returns(VirtualPlayerCommand.PLACE);
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const takeTurnSpy = sinon.spy(gameService, 'takeTurn');
        gameService.virtualPlayerAction(gameStub);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(placeStub.calledOnce);
        expect(!takeTurnSpy.calledOnce);
    });

    it('Should place when the VP choose to place', (done: Mocha.Done) => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
        virtualPlayerServiceStub.getPlacements.returns(new Promise((r) => setTimeout(r, MAX_THRESHOLD_MS * 2)));
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const takeTurnSpy = sinon.spy(gameService, 'virtualPlayerTakeTurn' as keyof GameService);
        gameService['virtualPlayerPlace'](gameStub);
        clock.tick(MAX_THRESHOLD_MS * 2);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(takeTurnSpy.calledOnce);
        clock.restore();
        done();
    });

    it('Should place when the VP choose to place', (done: Mocha.Done) => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
        virtualPlayerServiceStub.getPlacements.returns(new Promise((r) => setTimeout(r, MIN_THRESHOLD_MS)));
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        gameStub['currentPlayer'] = virtualPlayerStub;
        const takeTurnSpy = sinon.spy(gameService, 'virtualPlayerTakeTurn' as keyof GameService);
        gameService['virtualPlayerPlace'](gameStub);
        clock.tick(MAX_THRESHOLD_MS);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(!takeTurnSpy.calledOnce);
        clock.restore();
        done();
    });

    it('Should take turn when the Beginner VP choose to place but there are not placements', (done: Mocha.Done) => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
        virtualPlayerServiceStub.getPlacements.resolves([]);
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        virtualPlayerStub.level = VirtualPlayerLevel.BEGINNER;
        gameStub['currentPlayer'] = virtualPlayerStub;
        const takeTurnStub = sinon.stub(gameService, 'virtualPlayerTakeTurn' as keyof GameService);
        gameService['virtualPlayerPlace'](gameStub);
        clock.tick(MAX_THRESHOLD_MS);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(takeTurnStub.calledOnce);
        clock.restore();
        done();
    });

    it('Should exchange when the Expert VP choose to place but there are not placements', (done: Mocha.Done) => {
        const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
        virtualPlayerServiceStub.getPlacements.resolves([]);
        virtualPlayerStub.getScoreConstraint.returns(MOCK_SCORE_CONSTRAINTS);
        virtualPlayerStub.level = VirtualPlayerLevel.EXPERT;
        gameStub['currentPlayer'] = virtualPlayerStub;
        const exchangeStub = sinon.stub(gameService, 'virtualPlayerExchange' as keyof GameService);
        gameService['virtualPlayerPlace'](gameStub);
        clock.tick(MAX_THRESHOLD_MS);
        expect(virtualPlayerServiceStub.getPlacements.calledOnce);
        expect(exchangeStub.calledOnce);
        clock.restore();
        done();
    });

    it('Should place letters', () => {
        placementValidationServiceStub.isPlacementValid.returns({ validity: false, score: 0, placedWords: [] });
        expect(
            gameService['placeLetters'](gameStub, {
                position: { x: 0, y: 0 },
                axis: AXIS.HORIZONTAL,
                letters: [{ letter: 'a', point: 1 }],
            }),
        ).to.be.false;
    });

    it('Should convert placement to command', () => {
        placementValidationServiceStub.isPlacementValid.returns({ validity: false, score: 0, placedWords: [] });
        expect(
            gameService['placementToCommand']({
                position: { x: 1, y: 1 },
                axis: AXIS.HORIZONTAL,
                letters: 'ABC',
            }),
        ).to.equal('!placer a1h ABC');
    });

    it('Should convert placement to command', () => {
        placementValidationServiceStub.isPlacementValid.returns({ validity: false, score: 0, placedWords: [] });
        expect(
            gameService['placementToCommand']({
                position: { x: 1, y: 1 },
                axis: AXIS.VERTICAL,
                letters: 'ABC',
            }),
        ).to.equal('!placer a1v ABC');
    });

    it('Should set scores', () => {
        gameStub.type = GameType.SOLO;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = virtualPlayerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledOnce);
    });

    it('Should set scores', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.parameters.mode = GameMode.LOG2990;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = virtualPlayerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledOnce);
    });

    it('Should set scores', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.parameters.mode = GameMode.CLASSIC;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = virtualPlayerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledOnce);
    });

    it('Should set scores', () => {
        gameStub.type = GameType.SOLO;
        gameStub.currentPlayer = virtualPlayerStub;
        gameStub.otherPlayer = playerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledOnce);
    });

    it('Should set scores', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = virtualPlayerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledOnce);
    });

    it('Should set scores', () => {
        gameStub.type = GameType.MULTIPLAYER;
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = playerStub;
        gameService['setScores'](gameStub);
        expect(highScoresServiceStub.setScore.calledTwice);
    });

    it('Should return true the JV can play', () => {
        gameStub.type = GameType.SOLO;
        gameStub.currentPlayer = virtualPlayerStub;
        expect(gameService.isVirtualPlayerTurn(gameStub)).to.be.true;
    });

    it('Should handle placement with star', () => {
        expect(
            gameService['handlePlacementWithStar']({
                position: { x: 0, y: 0 },
                axis: AXIS.HORIZONTAL,
                letters: [
                    { letter: 'a', point: 1 },
                    { letter: 'B', point: 1 },
                    { letter: 'c', point: 1 },
                    { letter: 'D', point: 1 },
                ],
            }),
        ).to.deep.equal([
            { letter: 'a', point: 1 },
            { letter: '*', point: 1 },
            { letter: 'c', point: 1 },
            { letter: '*', point: 1 },
        ]);
    });

    it('Should return the game id 1', () => {
        gameService['games'].set('test', gameStub);
        expect(gameService.getGameIdFromPlayerId('test')).to.equal('test');
    });

    it('Should return the game id 2', () => {
        gameService['games'].set('test', gameStub);
        playerStub.getId.returns('test1');
        expect(gameService.getGameIdFromPlayerId('test1')).to.equal(MOCK_GAME_ID);
    });

    it('Should return the game id 3', () => {
        expect(gameService.getGameIdFromPlayerId('')).to.equal('');
    });

    it('Should surrender after closing tab', () => {
        const clock = sinon.useFakeTimers();
        const stub = sinon.stub(gameService, 'surrender');
        sinon.stub(gameService, 'getGameIdFromPlayerId').returns(MOCK_GAME_ID);
        gameService.surrenderAfterClosingTab(MOCK_PLAYER_ID);
        clock.tick(5500);
        expect(stub.calledOnce);
        clock.restore();
    });
});
