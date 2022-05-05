import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameType } from '@app/classes/game/game-type';
import { CreateGameComponent } from '@app/components/create-game/create-game.component';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { from } from 'rxjs';

import SpyObj = jasmine.SpyObj;

describe('CreateGameComponent', () => {
    let component: CreateGameComponent;
    let fixture: ComponentFixture<CreateGameComponent>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let roomServiceSpy: SpyObj<RoomService>;
    let routerSpy: SpyObj<Router>;
    let gameServiceSpy: SpyObj<GameService>;

    beforeEach(async () => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['getId', 'emit']);
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['createRoom']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: 'classic' });
        gameServiceSpy = jasmine.createSpyObj('GameService', [
            'setId',
            'setPlayer',
            'setTimerDuration',
            'updateAvailableDictionaries',
            'getAvailableDictionaries',
        ]);

        gameServiceSpy.getAvailableDictionaries.and.returnValue(from([[{ title: 'title', description: 'description', filename: 'filename' }]]));
        await TestBed.configureTestingModule({
            declarations: [CreateGameComponent],
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: RoomService, useValue: roomServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should create the back link to the right page', () => {
        component.gameType = GameType.SOLO;
        component.ngOnInit();
        expect(component.backLink).toEqual('cla');
    });

    it('Should create game when clicking on create', () => {
        component.gameType = GameType.SOLO;
        component.confirmed = true;
        fixture.detectChanges();
        const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('.create');
        createButton.disabled = false;
        createButton.click();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
        expect(gameServiceSpy.setId).toHaveBeenCalled();
        expect(gameServiceSpy.setPlayer).toHaveBeenCalled();
        expect(gameServiceSpy.setTimerDuration).toHaveBeenCalled();
    });

    it('Should create classic game when clicking on create', () => {
        component.gameType = GameType.SOLO;
        component.confirmed = true;
        Object.defineProperty(routerSpy, 'url', { value: ['classic'], writable: true });
        component.createGame();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });
    it('Should create log2990 game when clicking on create', () => {
        component.gameType = GameType.SOLO;
        component.confirmed = true;
        Object.defineProperty(routerSpy, 'url', { value: ['log2990'], writable: true });
        component.createGame();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('Should create log2990 game when clicking on create', () => {
        component.gameType = GameType.MULTIPLAYER;
        component.confirmed = true;
        fixture.detectChanges();
        const createRoomSpy = spyOn(component, 'createRoom');
        const createButton: HTMLButtonElement = fixture.nativeElement.querySelector('.create');
        createButton.disabled = false;
        createButton.click();
        expect(createRoomSpy).toHaveBeenCalled();
    });
    it('Should create room when createRoom is called', () => {
        component.createRoom();
        expect(roomServiceSpy.createRoom).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });
    it('Should create room when createRoom is called', () => {
        Object.defineProperty(routerSpy, 'url', { value: ['log2990'], writable: true });
        component.createRoom();
        expect(roomServiceSpy.createRoom).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalled();
    });

    it('Should confirm parameters when clicking on confirm', () => {
        component.confirmed = false;
        component.paramsForm.controls.name.setValue('Player');
        const confirmButton: HTMLButtonElement = fixture.nativeElement.querySelector('.confirm');
        confirmButton.disabled = false;
        confirmButton.click();
        expect(component.confirmed).toBeTrue();
        expect(component).toBeTruthy();
    });
});
