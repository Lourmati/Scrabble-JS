/* eslint-disable deprecation/deprecation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Letter } from '@app/classes/common/letter';
import { COMPONENT } from '@app/classes/control/component';
import { GameMode } from '@app/classes/game/game-mode';
import { ChatboxComponent } from '@app/components/chatbox/chatbox/chatbox.component';
import { ControlPanelComponent } from '@app/components/control-panel/control-panel.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GameDisplayService } from '@app/services/game-display/game-display.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject, of } from 'rxjs';
import { GamePageComponent } from './game-page.component';
import SpyObj = jasmine.SpyObj;

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameDisplayService: SpyObj<GameDisplayService>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let keyboardHandlerSpy: SpyObj<KeyboardHandlerService>;

    beforeEach(async () => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['on', 'isSocketAlive', 'connect', 'getId']);
        gameDisplayService = jasmine.createSpyObj('GameDisplayService', ['onUpdateEasel', 'onUpdateGrid', 'connect', 'registerEvents']);
        keyboardHandlerSpy = jasmine.createSpyObj('KeyboardHandlerService', ['takeControl', 'getCurrentController']);
        keyboardHandlerSpy.currentController = new BehaviorSubject<COMPONENT>(COMPONENT.CHATBOX);
        gameDisplayService.onUpdateEasel.and.returnValue(new BehaviorSubject<Letter[]>([]));
        keyboardHandlerSpy.getCurrentController.and.returnValue(new BehaviorSubject<COMPONENT>(COMPONENT.CHATBOX));
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent, PlayAreaComponent, ControlPanelComponent, EaselComponent, ChatboxComponent],
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: KeyboardHandlerService, useValue: keyboardHandlerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of([{ id: 1, mode: GameMode.LOG2990 }]),
                    },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('handle click should call takeControl', () => {
        fixture.debugElement.nativeElement.querySelector('.container').click();
        expect(keyboardHandlerSpy.takeControl).toHaveBeenCalled();
    });
});
