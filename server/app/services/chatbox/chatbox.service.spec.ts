/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable max-lines */
import Sinon = require('sinon');

import { Message } from '@app/classes/chatbox/message';
import { AXIS } from '@app/classes/grid/axis';
import * as CHATBOX from '@app/constants/chatbox';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { ParseLettersService } from '@app/services/parse-letter/parse-letter.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { expect } from 'chai';

const MOCK_GAME_ID = 'game_id';
const MOCK_PLAYER_ID = 'player_id';
const MOCK_PLAYER_NAME = 'player_name';
const MOCK_PLACEMENT = {
    position: { x: 0, y: 0 },
    axis: AXIS.HORIZONTAL,
    letters: [],
};

const MOCK_MESSAGE = (content: string): Message => {
    return {
        gameId: MOCK_GAME_ID,
        playerId: MOCK_PLAYER_ID,
        playerName: MOCK_PLAYER_NAME,
        content,
    };
};

describe('ChatboxService', () => {
    let chatboxService: ChatboxService;
    let socketCommunicationServiceStub: Sinon.SinonStubbedInstance<SocketCommunicationService>;
    let gameServiceStub: Sinon.SinonStubbedInstance<GameService>;
    let parseLetterServiceStub: Sinon.SinonStubbedInstance<ParseLettersService>;

    beforeEach(() => {
        socketCommunicationServiceStub = Sinon.createStubInstance(SocketCommunicationService);
        gameServiceStub = Sinon.createStubInstance(GameService);
        parseLetterServiceStub = Sinon.createStubInstance(ParseLettersService);
        chatboxService = new ChatboxService(socketCommunicationServiceStub, gameServiceStub, parseLetterServiceStub);
        parseLetterServiceStub.parseLetters.returns([]);
    });

    it('Should handle message', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleCommandFilters' as any);
        chatboxService.handleMessage(MOCK_MESSAGE('!passer'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle message', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        chatboxService.handleMessage(MOCK_MESSAGE('!other'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle message', (done: Mocha.Done) => {
        chatboxService.handleMessage(MOCK_MESSAGE('hey'));
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'place' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('!placer a2h letters'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'place' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('!échanger letters'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('!placer z2h letters'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('!échanger 192'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('!other'));
        expect(spy.calledOnce);
        done();
    });

    it('Should handle command filters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        chatboxService['handleCommandFilters'](MOCK_MESSAGE('other'));
        expect(spy.calledOnce);
        done();
    });

    it('Should tell if the message is a command', (done: Mocha.Done) => {
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!placer'))).to.be.true;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!échanger'))).to.be.true;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!passer'))).to.be.true;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!réserve'))).to.be.true;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!indice'))).to.be.true;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('!aide'))).to.be.true;

        expect(chatboxService['isCommand'](MOCK_MESSAGE('test'))).to.be.false;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('hey'))).to.be.false;
        expect(chatboxService['isCommand'](MOCK_MESSAGE('ok'))).to.be.false;
        done();
    });

    it('Should the command in the message', (done: Mocha.Done) => {
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!placer a2h LETTERS'))).to.equal('placer');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!échanger LETTERS'))).to.equal('échanger');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!passer'))).to.equal('passer');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!réserve'))).to.equal('réserve');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!indice'))).to.equal('indice');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('!aide'))).to.equal('aide');
        expect(chatboxService['getCommand'](MOCK_MESSAGE('test'))).to.equal('');
        done();
    });

    it('Should tell if the message is a known command', (done: Mocha.Done) => {
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!placer a2h LETTERS'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!échanger LETTERS'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!passer'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!réserve'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!indice'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!aide'))).to.be.true;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('!test'))).to.be.false;
        expect(chatboxService['isKnownCommand'](MOCK_MESSAGE('test'))).to.be.false;
        done();
    });

    it('Should handle error message', (done: Mocha.Done) => {
        chatboxService['handleError'](MOCK_MESSAGE('MESSAGE'), 'ERROR');
        expect(
            socketCommunicationServiceStub.emitToSocket.calledOnceWith(MOCK_PLAYER_ID, CHATBOX.CHATBOX_EVENT, { ...MOCK_MESSAGE, content: 'ERROR' }),
        );
        done();
    });

    it('Should create a server message', (done: Mocha.Done) => {
        expect(chatboxService['createServerMessage'](MOCK_GAME_ID, 'MESSAGE')).to.deep.equal({
            gameId: MOCK_GAME_ID,
            playerId: CHATBOX.SERVER_ID,
            playerName: CHATBOX.SERVER_NAME,
            content: 'MESSAGE',
        });
        done();
    });

    it('Should create a server message', (done: Mocha.Done) => {
        expect(chatboxService['createServerMessage'](MOCK_GAME_ID, 'MESSAGE')).to.deep.equal({
            gameId: MOCK_GAME_ID,
            playerId: CHATBOX.SERVER_ID,
            playerName: CHATBOX.SERVER_NAME,
            content: 'MESSAGE',
        });
        done();
    });

    it('Should return placement', (done: Mocha.Done) => {
        parseLetterServiceStub.parseLetters.returns([]);
        expect(chatboxService['extractPlacement']('!placer b3h ab', true)).to.deep.equal({
            position: { x: 2, y: 3 },
            axis: AXIS.HORIZONTAL,
            letters: [],
        });
        expect(parseLetterServiceStub.parseLetters.calledOnce);
        done();
    });

    it('Should return placement', (done: Mocha.Done) => {
        parseLetterServiceStub.parseLetters.returns([]);
        expect(chatboxService['extractPlacement']('!placer b3v ab', true)).to.deep.equal({
            position: { x: 2, y: 3 },
            axis: AXIS.VERTICAL,
            letters: [],
        });
        expect(parseLetterServiceStub.parseLetters.calledOnce);
        done();
    });

    it('Should return placement', (done: Mocha.Done) => {
        expect(chatboxService['extractPlacement']('!placer b3 c', false)).to.deep.equal({
            position: { x: 2, y: 3 },
            axis: AXIS.HORIZONTAL,
            letters: [],
        });
        expect(parseLetterServiceStub.parseLetters.calledOnce);
        done();
    });

    it('Should return placement', (done: Mocha.Done) => {
        expect(chatboxService['extractPlacement']('other', false)).to.be.null;
        done();
    });

    it('Should place without orientation', (done: Mocha.Done) => {
        const extractPlacementSpy = Sinon.spy(chatboxService, 'extractPlacement' as any);
        const placeSpy = Sinon.spy(chatboxService, 'place' as any);
        chatboxService['placeWithoutOrientation'](MOCK_MESSAGE('!placer a2 l'));
        expect(extractPlacementSpy.calledOnce);
        expect(placeSpy.calledOnce);
        done();
    });

    it('Should place', (done: Mocha.Done) => {
        expect(chatboxService['extractPlacement']('!placer b3 c', false)).to.deep.equal({
            position: { x: 2, y: 3 },
            axis: AXIS.HORIZONTAL,
            letters: [],
        });
        expect(parseLetterServiceStub.parseLetters.calledOnce);
        done();
    });

    it('Should place letters', (done: Mocha.Done) => {
        gameServiceStub.place.returns(true);
        chatboxService['place'](MOCK_MESSAGE('!placer a2 l'), MOCK_PLACEMENT);
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should place letters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        gameServiceStub.place.returns(false);
        chatboxService['place'](MOCK_MESSAGE('!placer a2 l'), MOCK_PLACEMENT);
        expect(spy.calledOnce);
        done();
    });

    it('Should exchange letters', (done: Mocha.Done) => {
        gameServiceStub.exchange.returns(true);
        chatboxService['exchange'](MOCK_MESSAGE('!échanger l'));
        expect(parseLetterServiceStub.parseLetters.calledOnce);
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        expect(socketCommunicationServiceStub.emitToRoomButSocket.calledOnce);
        done();
    });

    it('Should exchange letters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        gameServiceStub.exchange.returns(false);
        chatboxService['exchange'](MOCK_MESSAGE('other'));
        expect(spy.calledOnce);
        done();
    });

    it('Should exchange letters', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        gameServiceStub.exchange.returns(false);
        chatboxService['exchange'](MOCK_MESSAGE('!échanger l'));
        expect(spy.calledOnce);
        done();
    });

    it('Should take turn', (done: Mocha.Done) => {
        gameServiceStub.takeTurn.returns(true);
        chatboxService['takeTurn'](MOCK_MESSAGE('!passer'));
        expect(socketCommunicationServiceStub.emitToRoom.calledOnce);
        done();
    });

    it('Should take turn', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        gameServiceStub.takeTurn.returns(false);
        chatboxService['takeTurn'](MOCK_MESSAGE('!passer'));
        expect(spy.calledOnce);
        done();
    });

    it('Should return hints', (done: Mocha.Done) => {
        gameServiceStub.isThisPlayerTurn.returns(true);
        gameServiceStub.hints.returns('');
        chatboxService['hints'](MOCK_MESSAGE('!indice'));
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });

    it('Should return hints', (done: Mocha.Done) => {
        gameServiceStub.isThisPlayerTurn.returns(true);
        gameServiceStub.hints.returns('indices');
        chatboxService['hints'](MOCK_MESSAGE('!indice'));
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });

    it('Should return hints', (done: Mocha.Done) => {
        const spy = Sinon.spy(chatboxService, 'handleError' as any);
        gameServiceStub.isThisPlayerTurn.returns(false);
        chatboxService['hints'](MOCK_MESSAGE('!indice'));
        expect(spy.calledOnce);
        done();
    });

    it('Should return reserve content', (done: Mocha.Done) => {
        chatboxService['reserve'](MOCK_MESSAGE('!réserve'));
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });

    it('Should return help', (done: Mocha.Done) => {
        chatboxService['help'](MOCK_MESSAGE('!aide'));
        expect(socketCommunicationServiceStub.emitToSocket.calledOnce);
        done();
    });
});
