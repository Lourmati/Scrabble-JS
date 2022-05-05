/* eslint-disable @typescript-eslint/no-explicit-any */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { COMPONENT } from '@app/classes/control/component';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';
import { EaselManagerService } from '@app/services/easel/easel-manager/easel-manager.service';
import { GameDisplayService } from '@app/services/game-display/game-display.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Observable } from 'rxjs';
import { EaselComponent } from './easel.component';
import SpyObj = jasmine.SpyObj;
const MOCK_CARD = { letter: 'A', point: 0 };
describe('EaselComponent', () => {
    let component: EaselComponent;
    let fixture: ComponentFixture<EaselComponent>;
    let gameDisplayService: SpyObj<GameDisplayService>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let mockSocket: SocketTestHelper;
    let easelManagerSpy: SpyObj<EaselManagerService>;
    let keyboardHandlerSpy: SpyObj<KeyboardHandlerService>;

    beforeEach(() => {
        mockSocket = new SocketTestHelper();
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['on', 'connect']);
        socketManagerServiceSpy.on.and.callFake((event: string, action: (data: any) => void) => mockSocket.on(event, action));
        socketManagerServiceSpy.connect.and.callFake(() => {
            return;
        });
        gameDisplayService = jasmine.createSpyObj('GameDisplayService', ['onUpdateEasel']);
        gameDisplayService.onUpdateEasel.and.returnValue(new Observable());
        easelManagerSpy = jasmine.createSpyObj('EaselManagerSpy', ['handleKeyboardEvent']);
        keyboardHandlerSpy = jasmine.createSpyObj('KeyboardHanlerService', ['takeControl', 'getCurrentController']);
        keyboardHandlerSpy.getCurrentController.and.returnValue(new Observable());
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EaselComponent],
            providers: [
                { provide: EaselManagerService, useValue: easelManagerSpy },
                { provide: GameDisplayService, useValue: gameDisplayService },
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: KeyboardHandlerService, useValue: keyboardHandlerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(EaselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call moveRight', () => {
        component.isCurrentController = true;
        component.isCurrentPlayer = true;
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        expect(easelManagerSpy.handleKeyboardEvent).toHaveBeenCalled();
    });
    it('should call handleKeyboardEvent when is currentPlayer', () => {
        component.isCurrentPlayer = true;
        component.isCurrentController = true;
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(easelManagerSpy.handleKeyboardEvent).toHaveBeenCalled();
    });
    it('should call handleKeyboardEvent when is currentPlayer', () => {
        component.isCurrentController = true;
        component.isCurrentPlayer = true;
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(easelManagerSpy.handleKeyboardEvent).toHaveBeenCalled();
    });
    it('should not call handleKeyboardEvent when is not currentPlayer', () => {
        component.isCurrentController = false;
        component.isCurrentPlayer = false;
        component.handleKeyboardEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(easelManagerSpy.handleKeyboardEvent).not.toHaveBeenCalled();
    });
    it('keyboardHandler shouls call takeControl when there is a click', () => {
        const div = fixture.debugElement.query(By.css('.container'));
        div.nativeElement.click();
        expect(keyboardHandlerSpy.takeControl).toHaveBeenCalled();
    });

    it('handleEaselUpdate should update the easel', () => {
        component.letters = [];
        component.handleEaselUpdate([MOCK_CARD]);
        expect(component.letters[0].letter).toEqual(MOCK_CARD.letter);
    });
    it('handleEaselUpdate should not contain MOCK CARD', () => {
        component.letters = [];
        component.handleEaselUpdate([]);
        expect(component.letters.includes(MOCK_CARD)).toBeFalsy();
    });

    it('handleControllerChange should update the controller if there s a new Contoller', () => {
        component.isCurrentController = true;
        component.handleControllerChange(COMPONENT.CHATBOX);
        expect(component.isCurrentController).toBeFalse();
    });
    it(' should update the controller if there s a new Contoller', () => {
        component.isCurrentController = true;
        component.handleControllerChange(COMPONENT.CHATBOX);
        expect(component.isCurrentController).toBeFalse();
    });
    it(' isScrollDown should return true when its scroll down', () => {
        const event = new WheelEvent('wheel', { deltaY: 1, deltaX: 0 });
        expect(component.isScrollDown(event)).toBeTrue();
    });
    it(' onScroll call  handleKeyboard with ArrowRight when its scrolling down', () => {
        const event = new WheelEvent('wheel', { deltaY: -1, deltaX: 0 });
        component.onScroll(event);
        expect(easelManagerSpy.handleKeyboardEvent).toHaveBeenCalled();
    });
    it(' onScroll call  handleKeyboard with ArrowLeft when its scrolling up', () => {
        const event = new WheelEvent('wheel', { deltaY: 1, deltaX: 0 });
        component.onScroll(event);
        expect(easelManagerSpy.handleKeyboardEvent).toHaveBeenCalled();
    });
});
