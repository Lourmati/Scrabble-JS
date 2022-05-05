import { TestBed } from '@angular/core/testing';
import { KEY_LEFT, KEY_RIGHT } from '@app/constants/easel';
import { EaselManagerService } from '@app/services/easel/easel-manager/easel-manager.service';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { Observable } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('EaselManagerService', () => {
    let service: EaselManagerService;
    let easelServiceSpy: SpyObj<EaselService>;

    beforeEach(() => {
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['move', 'getCards', 'handleKeyboard']);
        easelServiceSpy.getCards.and.returnValue(new Observable());
        TestBed.configureTestingModule({ providers: [{ provide: EaselService, useValue: easelServiceSpy }] });
        service = TestBed.inject(EaselManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call move when key right is pressed', () => {
        service.handleKeyboardEvent(KEY_RIGHT);
        expect(easelServiceSpy.move).toHaveBeenCalled();
    });
    it('should call move when key left is pressed', () => {
        service.handleKeyboardEvent(KEY_LEFT);
        expect(easelServiceSpy.move).toHaveBeenCalled();
    });
    it('should call handleKeyboard', () => {
        service.handleKeyboardEvent('A');
        expect(easelServiceSpy.handleKeyboard).toHaveBeenCalled();
    });
});
