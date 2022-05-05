/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable dot-notation */
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Server } from 'app/server';
import { assert } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';

const RESPONSE_DELAY = 200;
const MOCK_NAME = 'name';
const MOCK_GAME_PARAMETERS: GameParameters = { mode: GameMode.CLASSIC, timer: 0, dictionary: '' };
const MOCK_ROOM_ID = 'room_id';
const MOCK_SOCKET_ID = 'socket_id';
const MOCK_PLAYER_INFORMATIONS: PlayerInformations = { id: MOCK_SOCKET_ID, name: MOCK_NAME };
const MOCK_MESSAGE = { gameId: MOCK_ROOM_ID, playerId: MOCK_SOCKET_ID, playerName: MOCK_NAME, content: 'CONTENT' };

describe('SocketManager service tests', () => {
    let service: SocketManagerService;
    let server: Server;
    let clientSocket: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManagerService'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('Should call roomService.create when receiving room:create', (done) => {
        const stub = sinon.stub(service['roomService'], 'create');
        clientSocket.emit('room:create', MOCK_NAME, MOCK_GAME_PARAMETERS);
        setTimeout(() => {
            assert(stub.calledOnceWith({ name: MOCK_NAME, id: clientSocket.id }, MOCK_GAME_PARAMETERS));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.delete when receiving room:cancel', (done) => {
        const stub = sinon.stub(service['roomService'], 'delete');
        clientSocket.emit('room:cancel');
        setTimeout(() => {
            assert(stub.calledOnceWith(clientSocket.id));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.joinRequest when receiving room:join_request', (done) => {
        const stub = sinon.stub(service['roomService'], 'joinRequest');
        clientSocket.emit('room:join_request', MOCK_PLAYER_INFORMATIONS, MOCK_ROOM_ID);
        setTimeout(() => {
            assert(stub.calledOnceWith(MOCK_PLAYER_INFORMATIONS, MOCK_ROOM_ID));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.cancelJoinRequest when receiving room:cancel_join_request', (done) => {
        const stub = sinon.stub(service['roomService'], 'cancelJoinRequest');
        clientSocket.emit('room:cancel_join_request', MOCK_ROOM_ID);
        setTimeout(() => {
            assert(stub.calledOnceWith(MOCK_ROOM_ID));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.acceptJoinRequest when receiving room:accept_join_request', (done) => {
        const stub = sinon.stub(service['roomService'], 'acceptJoinRequest');
        clientSocket.emit('room:accept_join_request', clientSocket.id);
        setTimeout(() => {
            assert(stub.calledOnceWith(clientSocket.id));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.rejectJoinRequest when receiving room:reject_join_request', (done) => {
        const stub = sinon.stub(service['roomService'], 'rejectJoinRequest');
        clientSocket.emit('room:reject_join_request', clientSocket.id);
        setTimeout(() => {
            assert(stub.calledOnceWith(clientSocket.id));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call roomService.getAvailableRooms when receiving room:available_rooms_request', (done) => {
        const stub = sinon.stub(service['roomService'], 'getAvailableRooms');
        clientSocket.emit('room:available_rooms_request');
        setTimeout(() => {
            assert(stub.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call gameService.createSoloGame when receiving game:create_solo', (done) => {
        const stub = sinon.stub(service['gameService'], 'createSoloGame');
        clientSocket.emit('game:create_solo', MOCK_NAME, MOCK_GAME_PARAMETERS, VirtualPlayerLevel.BEGINNER);
        setTimeout(() => {
            assert(stub.calledOnceWith({ name: MOCK_NAME, id: clientSocket.id }, MOCK_GAME_PARAMETERS, VirtualPlayerLevel.BEGINNER));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call chatboxService.handleMessage when receiving chatbox:message', (done) => {
        const stub = sinon.stub(service['chatboxService'], 'handleMessage');
        clientSocket.emit('chatbox:message', MOCK_MESSAGE);
        setTimeout(() => {
            assert(stub.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call gameService.surrender when receiving game:surrender', (done) => {
        const stub = sinon.stub(service['gameService'], 'surrender');
        clientSocket.emit('game:surrender', MOCK_ROOM_ID);
        setTimeout(() => {
            assert(stub.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should call gameService.surrender when receiving game:surrender', (done) => {
        const stub = sinon.stub(service['dictionaryService'], 'updateAvailableDictionaries');
        clientSocket.emit('dictionary:update');
        setTimeout(() => {
            assert(stub.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });
});
