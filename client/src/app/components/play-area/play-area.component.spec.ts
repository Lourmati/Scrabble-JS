/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPONENT } from '@app/classes/control/component';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { GameDisplayService } from '@app/services/game-display/game-display.service';
import { GameService } from '@app/services/game/game.service';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { GridService } from '@app/services/grid/grid/grid.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
import { MouseService } from '@app/services/mouse/mouse.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Observable } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let gridService: SpyObj<GridService>;
    let gameDisplayService: SpyObj<GameDisplayService>;
    let mouseService: SpyObj<MouseService>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let mockSocket: SocketTestHelper;
    let gridManagerService: SpyObj<GridManagerService>;
    let gameServiceSpy: SpyObj<GameService>;
    let keyboardHandler: SpyObj<KeyboardHandlerService>;
    let gridDrawingService: SpyObj<GridDrawingService>;

    beforeEach(async () => {
        keyboardHandler = jasmine.createSpyObj('KeyboardHandlerService', ['takeControl', 'getCurrentController']);
        keyboardHandler.getCurrentController.and.returnValue(new Observable());
        mockSocket = new SocketTestHelper();
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['on', 'connect', 'subscribe']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['getCurrentPlayerObservable', 'subscribe']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socketManagerServiceSpy.on.and.callFake((event: string, action: (data: any) => void) => mockSocket.on(event, action));
        gridService = jasmine.createSpyObj('GridService', ['updateGrid']);
        gridDrawingService = jasmine.createSpyObj('GridDrawingService', ['drawGrid', 'setSize']);
        gameDisplayService = jasmine.createSpyObj('GameDisplayService', ['onUpdateGrid']);
        gridManagerService = jasmine.createSpyObj('GridManagerService', ['handleKeyPressed']);
        mouseService = jasmine.createSpyObj('MouseService', ['mouseHitDetect']);
        gameServiceSpy.getCurrentPlayerObservable.and.returnValue(new Observable<boolean>());
        keyboardHandler.getCurrentController.and.returnValue(new Observable<COMPONENT>());
        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridService },
                { provide: GameDisplayService, gameDisplayService },
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: MouseService, useValue: mouseService },
                { provide: GridManagerService, useValue: gridManagerService },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: KeyboardHandlerService, useValue: keyboardHandler },
                { provide: GridDrawingService, gridDrawingService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should set size on service', () => {
        Object.defineProperty(component['gridCanvas'].nativeElement, 'parentElement', { value: undefined, writable: true });
        component.ngAfterViewInit();
        expect(component['gridCanvas'].nativeElement.width).toEqual(0);
    });

    it('Subscribe should call updgradeGrid ', () => {
        component.subscribe();
        expect(gridService.updateGrid).toHaveBeenCalled();
    });

    it('buttonDetect Should call handleKeyPressed', () => {
        component.isCurrentController = true;
        component.isCurrentPlayer = true;
        const mockPress = new KeyboardEvent('keydown', { key: 'Enter' });
        component.buttonDetect(mockPress);
        expect(component.width).toBeDefined();
        expect(component.height).toBeDefined();
        expect(gridManagerService.handleKeyPressed).toHaveBeenCalled();
    });
    it('Should detect button', () => {
        component.isCurrentController = false;
        component.isCurrentPlayer = true;
        const mockPress = new KeyboardEvent('keydown', { key: 'Enter' });
        component.buttonDetect(mockPress);
        expect(component.isCurrentController).toEqual(false);
    });

    it(' mouseHitDetect should call mouseService ', () => {
        component.mouseHitDetect(new MouseEvent('mousedown'));
        expect(mouseService.mouseHitDetect).toHaveBeenCalled();
    });
    it('handleControllerChange should update the controller if there s a new Contoller', () => {
        component.isCurrentController = true;
        component.handleControllerChange(COMPONENT.CHATBOX);
        expect(component.isCurrentController).toBeFalse();
    });
    it('handlePlayerChange should update the controller if there s a new Contoller', () => {
        component.isCurrentPlayer = false;
        component.handlePlayerChange(true);
        expect(component.isCurrentPlayer).toBeTrue();
    });
});
