/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { Server } from 'app/server';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as ioServer from 'socket.io';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
import { SocketCommunicationService } from './socket-communication.service';

const MOCK_ROOM_ID = 'room_id';
const MOCK_SOCKET_ID = 'socket_id';
const MOCK_EVENT = 'event';
const MOCK_DATA = null;
const RESPONSE_DELAY = 200;

describe('SocketCommunicationService', () => {
    let service: SocketCommunicationService;
    let server: Server;
    let clientSocket: Socket;

    const urlString = 'http://localhost:3000';
    beforeEach(async () => {
        server = Container.get(Server);
        server.init();
        service = server['socketManagerService']['socketCommunicationService'];
        clientSocket = ioClient(urlString);
    });

    afterEach(() => {
        clientSocket.close();
        service['sio'].close();
        sinon.restore();
    });

    it('Should set server', (done: Mocha.Done) => {
        service['sio'] = undefined as unknown as ioServer.Server;
        service.setServer(server['socketManagerService']['sio']);
        expect(service['sio']).to.equal(server['socketManagerService']['sio']);
        done();
    });

    it('Should emit event to room', (done: Mocha.Done) => {
        const serverToStub = sinon.stub(service['sio'], 'to').callThrough();
        setTimeout(() => {
            service.emitToRoom(clientSocket.id, MOCK_EVENT, MOCK_DATA);
            expect(serverToStub.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should emit event to socket when socket is connected', (done: Mocha.Done) => {
        const spy = sinon.spy(clientSocket, 'emit');
        setTimeout(() => {
            service.emitToSocket(clientSocket.id, MOCK_EVENT, MOCK_DATA);
            expect(spy.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should not emit event to socket when socket is not connected', (done: Mocha.Done) => {
        const spy = sinon.stub(clientSocket, 'emit');
        setTimeout(() => {
            service.emitToSocket(MOCK_SOCKET_ID, MOCK_EVENT, MOCK_DATA);
            expect(!spy.calledOnce);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should emit event to room but socket when socket is connected', (done: Mocha.Done) => {
        setTimeout(() => {
            service.emitToRoomButSocket(clientSocket.id, MOCK_ROOM_ID, MOCK_EVENT, MOCK_DATA);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should not emit event to room but socket when socket is not connected', (done: Mocha.Done) => {
        setTimeout(() => {
            service.emitToRoomButSocket(MOCK_SOCKET_ID, MOCK_ROOM_ID, MOCK_EVENT, MOCK_DATA);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should emit to broadcast', (done: Mocha.Done) => {
        const emitToBroadcastStub = sinon.spy(service['sio'].sockets, 'emit');
        setTimeout(() => {
            service.emitToBroadcast(MOCK_EVENT, MOCK_DATA);
            expect(emitToBroadcastStub.calledOnceWith(MOCK_EVENT, MOCK_DATA));
            done();
        }, RESPONSE_DELAY);
    });

    it('Should add socket to room when socket is connected', (done: Mocha.Done) => {
        setTimeout(() => {
            service.joinRoom(clientSocket.id, MOCK_ROOM_ID);
            expect(service['sio'].sockets.sockets.get(clientSocket.id)?.rooms).to.have.lengthOf(2);
            done();
        }, RESPONSE_DELAY);
    });

    it('Should not add socket to room when socket is not connected', (done: Mocha.Done) => {
        setTimeout(() => {
            service.joinRoom(MOCK_SOCKET_ID, MOCK_ROOM_ID);
            expect(service['sio'].sockets.sockets.get(clientSocket.id)?.rooms).to.have.lengthOf(1);
            done();
        }, RESPONSE_DELAY);
    });
});
