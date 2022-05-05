import { TestBed } from '@angular/core/testing';
import { DICTIONARY_UPDATE } from '@app/constants/events';
import { GameService } from '@app/services/game/game.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Observable } from 'rxjs';

import SpyObj = jasmine.SpyObj;

describe('GameService', () => {
    let service: GameService;
    let gameId: string;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    beforeEach(() => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['getId', 'connect', 'on', 'emit']);
        socketManagerServiceSpy.getId.and.returnValue('id');
        TestBed.configureTestingModule({
            providers: [{ provide: SocketManagerService, useValue: socketManagerServiceSpy }],
        });
        service = TestBed.inject(GameService);
        gameId = 'id';
        service.player = { id: 'id', name: 'name' };
        service.gameId = gameId;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should get game id ', () => {
        expect(service.getId()).toBe(gameId);
    });
    it('should get the name of the player', () => {
        expect(service.getPlayerName()).toBe('name');
    });
    it('should set the name of the player', () => {
        service.setPlayer('newName');
        expect(service.getPlayerName()).toBe('newName');
    });
    it('should set the game id of the service', () => {
        service.setId('newId');
        expect(service.getId()).toBe('newId');
    });
    it('should set currentPlayer true if currentPlayerId has the same id', () => {
        service.setCurrentPlayer('id');
        expect(service.isCurrentPlayer).toBe(true);
    });
    it('should set currentPlayer false if currentPlayerId has not the same id', () => {
        service.setCurrentPlayer('bad_id');
        expect(service.isCurrentPlayer).toBe(false);
    });

    it('Should return an observable when calling getCurrentPlayerObservable', () => {
        expect(service.getCurrentPlayerObservable()).toBeInstanceOf(Observable);
    });
    it('should set duration when setTimerDuration is called', () => {
        const duration = 60;
        service.setTimerDuration(duration);
        expect(service.timerDuration).toBe(duration);
    });

    it('Should update the available dictionaries', () => {
        service.updateAvailableDictionaries();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith(DICTIONARY_UPDATE);
    });

    it('Should return the available dictionaries', () => {
        expect(service.getAvailableDictionaries()).toBeInstanceOf(Observable);
    });

    it('Should handle available dictionaries update', () => {
        const spy = spyOn(service.availableDictionaries, 'next');
        service.handleAvailableDictionariesUpdate([]);
        expect(spy).toHaveBeenCalled();
    });
});
