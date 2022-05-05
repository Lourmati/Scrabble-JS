/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { AppMaterialModule } from '@app/modules/material.module';
import { MultiplayerWaitingPageComponent } from '@app/pages/multiplayer-waiting-page/multiplayer-waiting-page.component';
import { RoomService } from '@app/services/room/room.service';
import { Subject } from 'rxjs';
import SpyObj = jasmine.SpyObj;

const MOCK_NAME = 'name';
const MOCK_SOCKET_ID = 'socket_id';
const MOCK_PLAYER_INFORMATIONS: PlayerInformations = { id: MOCK_SOCKET_ID, name: MOCK_NAME };

describe('MultiplayerWaitingPageComponent', () => {
    let component: MultiplayerWaitingPageComponent;
    let fixture: ComponentFixture<MultiplayerWaitingPageComponent>;
    let roomServiceSpy: SpyObj<RoomService>;
    let router: SpyObj<Router>;
    let joinRequestHostStub: Subject<PlayerInformations>;

    beforeEach(async () => {
        roomServiceSpy = jasmine.createSpyObj('RoomService', ['getJoinRequestHost', 'acceptJoinRequest', 'rejectJoinRequest', 'cancelRoom']);
        router = jasmine.createSpyObj('Router', ['navigate'], { url: 'classic/multiplayer/waiting' });
        joinRequestHostStub = new Subject<PlayerInformations>();
        roomServiceSpy.getJoinRequestHost.and.returnValue(joinRequestHostStub.asObservable());

        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [MultiplayerWaitingPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            providers: [
                { provide: RoomService, useValue: roomServiceSpy },
                { provide: Router, useValue: router },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiplayerWaitingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should get informations from RoomService', () => {
        expect(roomServiceSpy.getJoinRequestHost).toHaveBeenCalled();
    });

    it('Should handle join request when calling handleJoinRequest', () => {
        component.handleJoinRequest(MOCK_PLAYER_INFORMATIONS);
        expect(component.guest).toEqual(MOCK_PLAYER_INFORMATIONS);
    });

    it('Should accept join request when calling accept', () => {
        component.accept();
        expect(roomServiceSpy.acceptJoinRequest).toHaveBeenCalled();
    });

    it('Should reject join request when calling reject', () => {
        component.reject();
        expect(roomServiceSpy.rejectJoinRequest).toHaveBeenCalled();
    });

    it('Should cancel room when calling cancelRoom', () => {
        component.cancelRoom();
        expect(roomServiceSpy.cancelRoom).toHaveBeenCalled();
    });
});
