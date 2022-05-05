/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { RoomInformations } from '@app/classes/room/room-informations';
import { RoomRequestStatus } from '@app/classes/room/room-request-status';
import { GAME_PAGE_PATH } from '@app/constants/game';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { TimerService } from '@app/services/timer/timer.service';
import { Subject } from 'rxjs';

import SpyObj = jasmine.SpyObj;

const MOCK_NAME = 'name';
const MOCK_ROOM_ID = 'room_id';
const MOCK_GAME_ID = { gameId: 'game_id', timer: 60 };
const MOCK_SOCKET_ID = 'socket_id';
const MOCK_PLAYER_INFORMATIONS: PlayerInformations = { id: MOCK_SOCKET_ID, name: MOCK_NAME };
const MOCK_PARAMETERS: GameParameters = { timer: 0, dictionary: 'dictionary', mode: GameMode.CLASSIC };
const MOCK_AVAILABLE_ROOMS: RoomInformations[] = [{ id: MOCK_ROOM_ID, playerName: MOCK_NAME, parameters: MOCK_PARAMETERS }];

describe('RoomService', () => {
    let service: RoomService;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let timerServiceSpy: SpyObj<TimerService>;
    let gameServiceSPy: SpyObj<GameService>;
    let routerSpy: SpyObj<Router>;
    let joinRequestHost: SpyObj<Subject<PlayerInformations>>;
    let joinRequestGuest: SpyObj<Subject<RoomRequestStatus>>;
    let availableRooms: SpyObj<Subject<RoomInformations[]>>;

    beforeEach(() => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['emit', 'getId', 'on', 'connect']);
        socketManagerServiceSpy.getId.and.returnValue(MOCK_SOCKET_ID);

        gameServiceSPy = jasmine.createSpyObj('GameService', ['setTimerDuration', 'setPlayer']);

        routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: 'log2990' });

        joinRequestHost = jasmine.createSpyObj('Subject', ['next', 'asObservable']);
        joinRequestGuest = jasmine.createSpyObj('Subject', ['next', 'asObservable']);
        availableRooms = jasmine.createSpyObj('Subject', ['next', 'asObservable']);

        timerServiceSpy = jasmine.createSpyObj('TimerService', ['setDuration', 'startTimer']);

        TestBed.configureTestingModule({
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: GameService, useValue: gameServiceSPy },
            ],
            imports: [
                RouterTestingModule.withRoutes([
                    { path: 'game?mode=log2990', component: GamePageComponent },
                    { path: 'game?mode=classic', component: GamePageComponent },
                ]),
            ],
            declarations: [GamePageComponent],
        });
        service = TestBed.inject(RoomService);
        service['joinRequestHost'] = joinRequestHost;
        service['joinRequestGuest'] = joinRequestGuest;
        service['availableRooms'] = availableRooms;
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(socketManagerServiceSpy.connect).toHaveBeenCalled();
    });

    it('Should create room when calling createRoom', () => {
        service.createRoom(MOCK_NAME, MOCK_PARAMETERS);
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:create', MOCK_NAME, MOCK_PARAMETERS);
    });

    it('Should cancel room when calling cancelRoom', () => {
        service.cancelRoom();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:cancel');
    });

    it('Should update available rooms when calling updateAvailableRooms', inject([Router], (router: Router) => {
        Object.defineProperty(router, 'url', { value: ['classic'], writable: true });
        service.updateAvailableRooms();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalled();
    }));
    it('Should update available rooms when calling updateAvailableRooms', inject([Router], (router: Router) => {
        Object.defineProperty(router, 'url', { value: ['log2990'], writable: true });
        service.updateAvailableRooms();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalled();
    }));

    it('Should accept join request when calling acceptJoinRequest', () => {
        service.acceptJoinRequest();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:accept_join_request');
    });

    it('Should reject join request when calling rejectJoinRequest', () => {
        service.rejectJoinRequest();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:reject_join_request');
    });

    it('Should send join request when calling joinRequest', () => {
        service.joinRequest(MOCK_NAME, MOCK_ROOM_ID);
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:join_request', { id: MOCK_SOCKET_ID, name: MOCK_NAME }, MOCK_ROOM_ID);
    });

    it('Should cancel join request when calling cancelJoinRequest', () => {
        service.cancelJoinRequest(MOCK_ROOM_ID);
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('room:cancel_join_request', MOCK_ROOM_ID);
    });

    it('Should handle events when calling handleEvents', () => {
        service.handleEvents();
        expect(socketManagerServiceSpy.on).toHaveBeenCalledTimes(6 * 2);
    });

    it('Should handle join request when calling handleJoinRequest', () => {
        service.handleJoinRequest(MOCK_PLAYER_INFORMATIONS);
        expect(joinRequestHost.next).toHaveBeenCalledOnceWith(MOCK_PLAYER_INFORMATIONS);
    });

    it('Should handle join request cancel when calling handleJoinRequestCancelled', () => {
        service.handleJoinRequestCancelled();
        expect(joinRequestHost.next).toHaveBeenCalledOnceWith(undefined);
    });

    it('Should handle join request rejected when calling handleJoinRequestRejected', () => {
        service.handleJoinRequestRejected();
        expect(joinRequestGuest.next).toHaveBeenCalledOnceWith(RoomRequestStatus.REJECTED);
    });

    it('Should handle join request aborted when calling handleJoinRequestAborted', () => {
        service.handleJoinRequestAborted();
        expect(joinRequestGuest.next).toHaveBeenCalledOnceWith(RoomRequestStatus.ABORTED);
    });

    it('Should handle available rooms updated when calling handleAvailableRoomsUpdated', () => {
        service.handleAvailableRoomsUpdated(MOCK_AVAILABLE_ROOMS);
        expect(availableRooms.next).toHaveBeenCalledOnceWith(MOCK_AVAILABLE_ROOMS);
    });

    it('Should handle game started when calling handleGameStarted', () => {
        service.handleGameStarted(MOCK_GAME_ID);
        expect(service['gameService'].gameId).toEqual(MOCK_GAME_ID.gameId);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/game'], { queryParams: { mode: 'log2990' } });
    });
    it('Should call setTimerDuration when calling handleGameStarted', () => {
        service.handleGameStarted(MOCK_GAME_ID);
        expect(gameServiceSPy.setTimerDuration).toHaveBeenCalled();
    });

    it('Should return join request host observable when calling getJoinRequestHost', () => {
        expect(service.getJoinRequestHost()).toEqual(service['joinRequestHost'].asObservable());
    });

    it('Should return join request guest observable when calling getJoinRequestGuest', () => {
        expect(service.getJoinRequestGuest()).toEqual(service['joinRequestGuest'].asObservable());
    });

    it('Should return available rooms observable when calling getAvailableRooms', () => {
        expect(service.getAvailableRooms()).toEqual(service['availableRooms'].asObservable());
    });

    it('Should return the right gameMode based on the url', () => {
        Object.defineProperty(routerSpy, 'url', { value: ['classic'], writable: true });
        expect(service.getGameMode()).toEqual(GameMode.CLASSIC);
    });

    it('Should return the right gameMode based on the url', () => {
        Object.defineProperty(routerSpy, 'url', { value: ['log2990'], writable: true });
        expect(service.getGameMode()).toEqual(GameMode.LOG2990);
    });
    it('changeLocation should call navigate from router when gameMode is log2990', () => {
        const spy = spyOn(service, 'getGameMode');
        spy.and.returnValue(GameMode.LOG2990);
        service.changeLocation();
        expect(routerSpy.navigate).toHaveBeenCalledWith([GAME_PAGE_PATH], { queryParams: { mode: 'log2990' } });
    });
    it('changeLocation should call navigate from router when gameMOde is classic', () => {
        const spy = spyOn(service, 'getGameMode');
        spy.and.returnValue(GameMode.CLASSIC);
        service.changeLocation();
        expect(routerSpy.navigate).toHaveBeenCalledWith([GAME_PAGE_PATH], { queryParams: { mode: 'classic' } });
    });
});
