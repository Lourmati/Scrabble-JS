import { TestBed } from '@angular/core/testing';
import { COMPONENT } from '@app/classes/control/component';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { KeyboardHandlerService } from './keyboard-handler.service';
import SpyObj = jasmine.SpyObj;

describe('KeyboardHandlerService', () => {
    let service: KeyboardHandlerService;
    let gridManagerSpy: SpyObj<GridManagerService>;
    let easelServiceSpy: SpyObj<EaselService>;

    beforeEach(() => {
        gridManagerSpy = jasmine.createSpyObj('GridManagerService', ['handleEscape']);
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['reset']);
        TestBed.configureTestingModule({
            providers: [
                { provide: GridManagerService, useValue: gridManagerSpy },
                { provide: EaselService, useValue: easelServiceSpy },
            ],
        });
        service = TestBed.inject(KeyboardHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call easeltakecontrol', () => {
        const spy = spyOn(service, 'easelTakeControl');
        service.takeControl(COMPONENT.EASEL);
        expect(spy).toHaveBeenCalled();
    });
    it('should call gridtakecontrol', () => {
        const spy = spyOn(service, 'gridTakeControl');
        service.takeControl(COMPONENT.GRID);
        expect(spy).toHaveBeenCalled();
    });
    it('should call chatboxtakecontrol', () => {
        const spy = spyOn(service, 'chatboxTakeControl');
        service.takeControl(COMPONENT.CHATBOX);
        expect(spy).toHaveBeenCalled();
        expect(easelServiceSpy);
    });
    it('getCurrentController should call asObservable ', () => {
        const spy = spyOn(service.currentController, 'asObservable');
        service.getCurrentController();
        expect(spy).toHaveBeenCalled();
    });
    it('chatboxtakecontrol should call reset', () => {
        service.chatboxTakeControl();
        expect(easelServiceSpy.reset).toHaveBeenCalled();
    });
    it('easeltakeControl should call handleEscape', () => {
        service.easelTakeControl();
        expect(gridManagerSpy.handleEscape).toHaveBeenCalled();
    });
    it('gridtakeControl should call handleEscape', () => {
        service.gridTakeControl();
        expect(easelServiceSpy.reset).toHaveBeenCalled();
    });
    it('pageTakeControl should call handleEscape', () => {
        service.pageTakeControl();
        expect(gridManagerSpy.handleEscape).toHaveBeenCalled();
    });
    it('pageTakeControl should call reset', () => {
        service.pageTakeControl();
        expect(easelServiceSpy.reset).toHaveBeenCalled();
    });
});
