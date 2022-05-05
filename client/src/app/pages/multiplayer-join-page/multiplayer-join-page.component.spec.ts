/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameMode } from '@app/classes/game/game-mode';
import { RoomInformations } from '@app/classes/room/room-informations';
import { RoomRequestStatus } from '@app/classes/room/room-request-status';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { Subject } from 'rxjs';
import { MultiplayerJoinPageComponent } from './multiplayer-join-page.component';
import SpyObj = jasmine.SpyObj;

const MOCK_ROOM: RoomInformations = { id: 'id', playerName: 'name', parameters: { timer: 0, dictionary: 'dictionary', mode: GameMode.CLASSIC } };
const MESSAGE_ABORTED = "Cette partie n'existe plus, veuillez en sélectionner une autre.";
const MESSAGE_REJECTED = "L'hôte de la partie a rejeté votre demande, veuillez sélectionner une autre partie.";

describe('MultiplayerJoinPageComponent', () => {
    let component: MultiplayerJoinPageComponent;
    let fixture: ComponentFixture<MultiplayerJoinPageComponent>;

    let roomServiceSpy: SpyObj<RoomService>;
    let gameServiceSpy: SpyObj<GameService>;
    let routerSpy: SpyObj<Router>;

    let availableRoomsStub: Subject<RoomInformations[]>;
    let joinRequestGuestStub: Subject<RoomRequestStatus>;

    beforeEach(async () => {
        availableRoomsStub = new Subject<RoomInformations[]>();
        joinRequestGuestStub = new Subject<RoomRequestStatus>();

        roomServiceSpy = jasmine.createSpyObj('RoomService', [
            'getAvailableRooms',
            'getJoinRequestGuest',
            'updateAvailableRooms',
            'cancelJoinRequest',
            'joinRequest',
        ]);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['setPlayer']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: 'classic/multiplayer/join' });

        roomServiceSpy.getAvailableRooms.and.returnValue(availableRoomsStub.asObservable());
        roomServiceSpy.getJoinRequestGuest.and.returnValue(joinRequestGuestStub.asObservable());

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [MultiplayerJoinPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: RoomService, useValue: roomServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerJoinPageComponent);
        component = fixture.componentInstance;
        component.availableRooms = [MOCK_ROOM];
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should get informations from RoomService', () => {
        expect(roomServiceSpy.getAvailableRooms).toHaveBeenCalled();
        expect(roomServiceSpy.getJoinRequestGuest).toHaveBeenCalled();
        expect(roomServiceSpy.updateAvailableRooms).toHaveBeenCalled();
    });

    it('Should select room when clicking on a room', () => {
        component.isSelected = false;
        fixture.detectChanges();
        const selectRoomSpy = spyOn(component, 'selectRoom');
        const selectButton: HTMLElement = fixture.nativeElement.querySelector('.select');
        selectButton.click();
        expect(selectRoomSpy).toHaveBeenCalled();
    });

    it('Should select room when clicking on a room', () => {
        component.selectRoom('roomId');
        expect(component.isSelected).toBeTrue();
        expect(component['selectedRoomId']).toEqual('roomId');
    });

    it('Should select room randomly when clicking on random button', () => {
        component.availableRooms = [MOCK_ROOM, MOCK_ROOM, MOCK_ROOM];
        component.isSelected = false;
        fixture.detectChanges();
        const selectRandomRoomSpy = spyOn(component, 'selectRandomRoom');
        const selectRandomButton: HTMLElement = fixture.nativeElement.querySelector('.select-random');
        selectRandomButton.click();
        expect(selectRandomRoomSpy).toHaveBeenCalled();
    });

    it('Should select room randomly when clicking on random button', () => {
        const selectRoomSpy = spyOn(component, 'selectRoom');
        component.selectRandomRoom();
        expect(selectRoomSpy).toHaveBeenCalled();
        // Seule partie disponible dans le test
        expect(selectRoomSpy).toHaveBeenCalledWith('id');
    });

    it('Should send join request when clicking on join button', () => {
        component.name = 'name';
        component['selectedRoomId'] = 'id';
        component.joinRequest();
        expect(component.isWaiting).toBeTrue();
        expect(gameServiceSpy.setPlayer).toHaveBeenCalledWith('name');
        expect(roomServiceSpy.joinRequest).toHaveBeenCalledWith('name', 'id');
    });

    it('Should cancel join request when clicking on cancel button', () => {
        component.isSelected = true;
        component.isWaiting = true;
        fixture.detectChanges();
        const cancelRequestSpy = spyOn(component, 'cancelJoinRequest');
        const cancelRequestButton: HTMLElement = fixture.nativeElement.querySelector('.cancel-request');
        cancelRequestButton.click();
        expect(cancelRequestSpy).toHaveBeenCalled();
    });

    it('Should cancel join request when clicking on cancel button', () => {
        component['selectedRoomId'] = 'id';
        component.cancelJoinRequest();
        expect(component.isWaiting).toBeFalse();
        expect(component.isSelected).toBeFalse();
        expect(component.message).toEqual('');
        expect(roomServiceSpy.cancelJoinRequest).toHaveBeenCalledWith('id');
    });

    it('Should update available rooms', () => {
        component.availableRooms = [];
        component.handleAvailableRoomsUpdated([MOCK_ROOM]);
        expect(component.availableRooms).toEqual([MOCK_ROOM]);
    });

    it('Should update status of join request', () => {
        component.message = '';
        component.handleStatusUpdated(RoomRequestStatus.ABORTED);
        expect(component.message).toEqual(MESSAGE_ABORTED);
    });

    it('Should update status of join request', () => {
        component.message = '';
        component.handleStatusUpdated(RoomRequestStatus.REJECTED);
        expect(component.message).toEqual(MESSAGE_REJECTED);
    });

    it('Should update status of join request', () => {
        component.message = '';
        component.handleStatusUpdated(undefined as unknown as RoomRequestStatus);
        expect(component.message).toEqual('');
    });
    it('Should update status of join request', () => {
        component.message = '';
        component.handleStatusUpdated(undefined as unknown as RoomRequestStatus);
        expect(component.message).toEqual('');
    });
    it('Should return false is the name is invalid', () => {
        component.nameForm.controls['name'].setValue('Player-Name');
        const invalid = component.hasError('name', 'pattern');
        expect(invalid).toEqual(true);
    });
});
