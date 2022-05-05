/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable dot-notation */
import { Easel } from '@app/classes/easel/easel';
import { Game } from '@app/classes/game/game';
import { GridServer } from '@app/classes/grid/grid';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { Player } from '@app/classes/player/player';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { UpdateService } from '@app/services/update/update.service';
import { expect } from 'chai';
import Sinon = require('sinon');

const OBJECTIVES_NUMBER = 2;
const OBJECTIVES_LENGHT_PUBLIC = 1;

describe('UpdateService', () => {
    let socketCommunicationServiceStub: Sinon.SinonStubbedInstance<SocketCommunicationService>;
    let objectivesServiceStub: Sinon.SinonStubbedInstance<ObjectivesService>;
    let gameStub: Sinon.SinonStubbedInstance<Game>;
    let playerStub: Sinon.SinonStubbedInstance<Player>;
    let easelStub: Sinon.SinonStubbedInstance<Easel>;
    let gridStub: Sinon.SinonStubbedInstance<GridServer>;
    let updateService: UpdateService;

    beforeEach(() => {
        socketCommunicationServiceStub = Sinon.createStubInstance(SocketCommunicationService);
        objectivesServiceStub = Sinon.createStubInstance(ObjectivesService);

        easelStub = Sinon.createStubInstance(Easel);
        easelStub.getContent.returns([]);

        playerStub = Sinon.createStubInstance(Player);
        playerStub.getId.returns('playerId');
        playerStub.getName.returns('playerName');
        playerStub.getScore.returns(0);
        playerStub.getEasel.returns(easelStub);

        gameStub = Sinon.createStubInstance(Game);
        gameStub.currentPlayer = playerStub;
        gameStub.otherPlayer = playerStub;
        gameStub.grid = gridStub;
        gameStub.getSidebarInformations.returns({
            reserveSize: 0,
            currentPlayerId: '',
            players: [
                {
                    playerId: '',
                    playerName: '',
                    score: 0,
                    easelSize: 0,
                },
                {
                    playerId: '',
                    playerName: '',
                    score: 0,
                    easelSize: 0,
                },
            ],
        });

        updateService = new UpdateService(socketCommunicationServiceStub, objectivesServiceStub);
    });

    it('Should update client', (done: Mocha.Done) => {
        const updateGridSpy = Sinon.stub(updateService, 'updateGrid' as keyof UpdateService);
        const updateEaselSpy = Sinon.stub(updateService, 'updateEasel' as keyof UpdateService);
        const updateSidebarSpy = Sinon.stub(updateService, 'updateSidebar' as keyof UpdateService);
        const updateObjectivesSpy = Sinon.stub(updateService, 'updateObjectives' as keyof UpdateService);
        updateService.updateClient(gameStub);
        expect(updateGridSpy.calledOnce);
        expect(updateEaselSpy.calledOnce);
        expect(updateSidebarSpy.calledOnce);
        expect(updateObjectivesSpy.calledOnce);
        done();
    });

    it('Should update end scores', (done: Mocha.Done) => {
        updateService.updateEndScores(gameStub);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should update other player', (done: Mocha.Done) => {
        updateService.updateAfterSurrender(gameStub, 'playerId');
        expect(socketCommunicationServiceStub.emitToRoomButSocket.calledOnce);
        done();
    });

    it('Should update easel', (done: Mocha.Done) => {
        updateService['updateEasel'](gameStub);
        expect(socketCommunicationServiceStub.emitToSocket.calledTwice);
        done();
    });

    it('Should update grid', (done: Mocha.Done) => {
        updateService['updateGrid'](gameStub);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should update sidebar', (done: Mocha.Done) => {
        updateService['updateSidebar'](gameStub);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should update objectives', (done: Mocha.Done) => {
        const spy = Sinon.spy(updateService, 'emitObjectives' as keyof UpdateService);
        const obj1: Objective = {
            id: '1',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 1,
        };

        const obj2: Objective = {
            id: '2',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 2,
        };

        const objectivesMock: Objective[] = [obj1, obj2];
        gameStub.objectives = objectivesMock;

        updateService['updateObjectives'](gameStub);
        expect(spy.callCount).to.equals(OBJECTIVES_NUMBER);
        done();
    });

    it('Should emit the public objective', (done: Mocha.Done) => {
        const obj1: Objective = {
            id: '1',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 1,
        };
        const objectives: Objective[] = [];

        updateService['emitObjectives'](obj1, objectives);
        expect(objectives.length).to.equals(OBJECTIVES_LENGHT_PUBLIC);
        done();
    });

    it('Should emit the private objective', (done: Mocha.Done) => {
        const obj2: Objective = {
            id: '2',
            title: 'stub-private',
            description: 'stub-private description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 1,
        };

        const objectives: Objective[] = [];

        updateService['emitObjectives'](obj2, objectives);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should update objective', (done: Mocha.Done) => {
        const placedWords: string[] = [];
        const obj: Objective = {
            id: 'playerId',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 1,
        };
        gameStub.objectives = [obj];
        gameStub.startTurn = new Date();
        objectivesServiceStub.wordContainsFourVowels.returns(true);
        playerStub.getId.returns('playerId');
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(obj.checked).to.be.true;
        done();
    });

    it('Should not update objective', (done: Mocha.Done) => {
        const placedWords: string[] = [];
        const obj: Objective = {
            id: 'playerId',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PRIVATE,
            checked: false,
            done: false,
            code: 1,
        };
        gameStub.objectives = [obj];
        gameStub.startTurn = new Date();
        objectivesServiceStub.wordContainsFourVowels.returns(true);
        playerStub.getId.returns('otherPlayerId');
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(obj.checked).to.be.false;
        done();
    });

    it('Should call wordwordContainsFourVowels when objective.code = 1', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 1,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.wordBeginsAndEndsWithVowel.calledOnce);
        done();
    });

    it('Should call hundredPointsWithoutExchangeOrHint when objective.code = 2', (done: Mocha.Done) => {
        const placedWords: string[] = [];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 2,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.hundredPointsWithoutExchangeOrHint.calledOnce);
        done();
    });

    it('Should call placementLessFiveSeconds when objective.code = 3', (done: Mocha.Done) => {
        const placedWords: string[] = [];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 3,
        };
        gameStub.objectives = [obj];
        gameStub.startTurn = new Date();
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.placementLessFiveSeconds.calledOnce);
        done();
    });

    it('Should call wordIsPalindrome when objective.code = 4', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 4,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.wordIsPalindrome.calledOnce);
        done();
    });
    it('Should call wordContainsNoConsonants when objective.code = 5', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 5,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.wordContainsNoConsonants.calledOnce);
        done();
    });
    it('Should call wordBeginsAndEndsWithVowel when objective.code = 6', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 6,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.wordBeginsAndEndsWithVowel.calledOnce);
        done();
    });
    it('Should call positionO15Filled when objective.code = 7', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 7,
        };
        gameStub.objectives = [obj];
        gameStub.grid = new GridServer();
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.positionO15Filled.calledOnce);
        done();
    });
    it('Should call wordIsAnagram when objective.code = 8', (done: Mocha.Done) => {
        const placedWords = ['Bonjour'];
        const obj: Objective = {
            id: '2',
            title: 'stub-public',
            description: 'stub-public description',
            points: 12,
            type: ObjectiveType.PUBLIC,
            checked: false,
            done: false,
            code: 8,
        };
        gameStub.objectives = [obj];
        updateService['updateObjectivesEachTurn'](gameStub, placedWords);
        expect(objectivesServiceStub.wordIsAnagram.calledOnce);
        done();
    });
});
