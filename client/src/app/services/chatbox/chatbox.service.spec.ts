import { TestBed } from '@angular/core/testing';
import { Message } from '@app/classes/chatbox/message';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { isObservable } from 'rxjs';

import SpyObj = jasmine.SpyObj;

describe('ChatboxServiceService', () => {
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let gameServiceSpy: SpyObj<GameService>;
    let service: ChatboxService;

    beforeEach(() => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['isSocketAlive', 'getId', 'on', 'emit', 'connect']);
        socketManagerServiceSpy.getId.and.returnValue('my-id');

        gameServiceSpy = jasmine.createSpyObj('GameService', ['getId', 'getPlayerName']);
        gameServiceSpy.getId.and.returnValue('gameId');
        gameServiceSpy.getPlayerName.and.returnValue('playerName');
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
        service = TestBed.inject(ChatboxService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should connect to server', () => {
        expect(socketManagerServiceSpy.connect).toHaveBeenCalled();
        expect(socketManagerServiceSpy.on).toHaveBeenCalled();
    });

    it('Should add new message to observable on chatbox:message event from server', () => {
        const mockMessage: Message = { gameId: 'gameId', playerId: 'server', playerName: 'Server', content: 'content', cssClass: 'by-server' };
        service.messagesSource.subscribe((newMessage: Message) => {
            expect(newMessage).toEqual(mockMessage);
        });
        service.onMessage(mockMessage);
    });

    it('Should return an observable when calling getMessages', () => {
        expect(isObservable(service.getMessages())).toBeTrue();
    });

    it("Should apply the right CSS class based on the message's author", () => {
        expect(service.getStyleFromAuthor('my-id')).toBe('by-me');
    });

    it("Should apply the right CSS class based on the message's author", () => {
        expect(service.getStyleFromAuthor('other-player-id')).toBe('by-other-player');
    });

    it("Should apply the right CSS class based on the message's author", () => {
        expect(service.getStyleFromAuthor('server')).toBe('by-server');
    });

    it('Should emit chatbox:message event when calling emitMessage with socket', () => {
        socketManagerServiceSpy.isSocketAlive.and.returnValue(true);
        const mockMessage = { gameId: 'gameId', playerId: 'my-id', playerName: 'playerName', content: 'content' };
        service.emitMessage('content');
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('chatbox:message', mockMessage);
    });

    it('Should not emit chatbox:message event when calling sendMessage without socket', () => {
        socketManagerServiceSpy.isSocketAlive.and.returnValue(false);
        service.emitMessage('content');
        expect(socketManagerServiceSpy.emit).not.toHaveBeenCalled();
    });
});
