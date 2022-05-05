/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import sinon = require('sinon');
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { Room } from '@app/classes/room/room';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { expect } from 'chai';

const MOCK_PLAYER: PlayerInformations = { id: 'player_id', name: 'player_name' };
const MOCK_GAME_PARAMETERS: GameParameters = { mode: GameMode.CLASSIC, timer: 0, dictionary: '' };

describe('RoomService', () => {
    let roomService: RoomService;
    let socketCommunicationServiceStub: sinon.SinonStubbedInstance<SocketCommunicationService>;
    let gameServiceStub: sinon.SinonStubbedInstance<GameService>;
    let dictionaryServiceStub: sinon.SinonStubbedInstance<DictionaryService>;
    let roomStub: sinon.SinonStubbedInstance<Room>;

    beforeEach(() => {
        socketCommunicationServiceStub = sinon.createStubInstance(SocketCommunicationService);
        gameServiceStub = sinon.createStubInstance(GameService);
        dictionaryServiceStub = sinon.createStubInstance(DictionaryService);
        roomService = new RoomService(socketCommunicationServiceStub, gameServiceStub, dictionaryServiceStub);

        roomStub = sinon.createStubInstance(Room);
        roomStub.id = 'id';
        roomStub.host = MOCK_PLAYER;
        roomStub.parameters = MOCK_GAME_PARAMETERS;
        roomStub.isFull.returns(false);
        roomService.rooms.set('id', roomStub);

        dictionaryServiceStub.getTitle.returns(MOCK_GAME_PARAMETERS.dictionary);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('Should init room map (constructor)', (done: Mocha.Done) => {
        expect(roomService.rooms).to.not.be.undefined;
        done();
    });

    it('Should return available rooms (getAvailableRooms)', (done: Mocha.Done) => {
        const rooms = roomService.getAvailableRooms(GameMode.CLASSIC);
        expect(rooms).to.have.lengthOf(1);
        expect(rooms[0].id).to.equal('id');
        expect(rooms[0].parameters).to.deep.equal(MOCK_GAME_PARAMETERS);
        expect(rooms[0].playerName).to.equal(MOCK_PLAYER.name);
        done();
    });

    it('Should return available rooms (getAvailableRooms)', (done: Mocha.Done) => {
        roomStub.isFull.returns(true);
        const rooms = roomService.getAvailableRooms(GameMode.LOG2990);
        expect(rooms).to.be.an('array').that.is.empty;
        done();
    });

    it('Should return available rooms (getAvailableRooms)', (done: Mocha.Done) => {
        roomService.rooms = new Map();
        const rooms = roomService.getAvailableRooms(GameMode.CLASSIC);
        expect(rooms).to.be.an('array').that.is.empty;
        done();
    });

    it('Should update the available rooms on all clients (updateAvailableRooms)', (done: Mocha.Done) => {
        roomService.updateAvailableRooms();
        expect(socketCommunicationServiceStub.emitToBroadcast.calledOnce);
        done();
    });

    it('Should create room (create)', (done: Mocha.Done) => {
        MOCK_PLAYER.id = 'test_id';
        const updateAvailableRoomsStub = sinon.stub(roomService, 'updateAvailableRooms');
        roomService.create(MOCK_PLAYER, MOCK_GAME_PARAMETERS);
        expect(roomService.rooms.has('test_id')).to.be.true;
        expect(roomService.rooms.get('test_id')).to.be.an.instanceof(Room);
        expect(updateAvailableRoomsStub.calledOnce);
        expect(dictionaryServiceStub.useDictionary.calledOnce);
        done();
    });

    it('Should delete room (delete)', (done: Mocha.Done) => {
        const updateAvailableRoomsStub = sinon.stub(roomService, 'updateAvailableRooms');
        roomService.delete('fake_id');
        expect(!updateAvailableRoomsStub.calledOnce);
        expect(!dictionaryServiceStub.releaseDictionary.calledOnce);
        done();
    });

    it('Should delete room (delete)', (done: Mocha.Done) => {
        const updateAvailableRoomsStub = sinon.stub(roomService, 'updateAvailableRooms');
        roomService.delete('id');
        expect(roomService.rooms.has('id')).to.be.false;
        expect(updateAvailableRoomsStub.calledOnce);
        expect(dictionaryServiceStub.releaseDictionary.calledOnce);
        done();
    });

    it('Should delete room (delete)', (done: Mocha.Done) => {
        const updateAvailableRoomsStub = sinon.stub(roomService, 'updateAvailableRooms');
        roomStub.guest = MOCK_PLAYER;
        roomStub.isFull.returns(true);
        roomService.delete('id');
        expect(roomService.rooms.has('id')).to.be.false;
        expect(updateAvailableRoomsStub.calledOnce);
        expect(dictionaryServiceStub.releaseDictionary.calledOnce);
        done();
    });

    it('Should send join request when the room is available (joinRequest)', (done: Mocha.Done) => {
        roomStub.isFull.returns(false);
        roomService.joinRequest(MOCK_PLAYER, 'id');
        expect(roomStub.addGuest.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should not send join request when the room is not available (joinRequest)', (done: Mocha.Done) => {
        roomStub.isFull.returns(true);
        const updateAvailableRoomsStub = sinon.stub(roomService, 'updateAvailableRooms');
        roomService.joinRequest(MOCK_PLAYER, 'id');
        expect(updateAvailableRoomsStub.calledOnce);
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });

    it('Coverage branch test (joinRequest)', (done: Mocha.Done) => {
        // Situation qui n'arrivera pas en réalité
        roomStub.isFull.returns(false);
        const roomsGetStub = sinon.stub(roomService.rooms, 'get').returns(undefined);
        roomService.joinRequest(MOCK_PLAYER, 'id');
        expect(roomStub.addGuest.calledOnce).to.be.false;
        expect(roomsGetStub.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should cancel join request (cancelJoinRequest)', (done: Mocha.Done) => {
        roomService.cancelJoinRequest('id');
        expect(roomStub.removeGuest.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Coverage branch test (cancelJoinRequest)', (done: Mocha.Done) => {
        // Situation qui n'arrivera pas en réalité
        const roomsGetStub = sinon.stub(roomService.rooms, 'get').returns(undefined);
        roomService.cancelJoinRequest('id');
        expect(roomStub.removeGuest.calledOnce).to.be.false;
        expect(roomsGetStub.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should accept request if a player wants to join (acceptJoinRequest)', (done: Mocha.Done) => {
        roomStub.isFull.returns(true);
        roomStub.guest = MOCK_PLAYER;
        roomService.acceptJoinRequest('id');
        expect(socketCommunicationServiceStub.joinRoom.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        expect(gameServiceStub.createMultiplayerGame.calledOnce);
        done();
    });

    it('Should not accept request if no player wants to join (acceptJoinRequest)', (done: Mocha.Done) => {
        roomService.acceptJoinRequest('id');
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });

    it('Should reject join request (rejectJoinRequest)', (done: Mocha.Done) => {
        roomStub.guest = MOCK_PLAYER;
        roomService.rejectJoinRequest('id');
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        expect(roomStub.removeGuest.calledOnce);
        done();
    });

    it("Should do nothing if the room doesn't exist (rejectJoinRequest)", (done: Mocha.Done) => {
        roomService.rejectJoinRequest('fake_id');
        done();
    });
});
