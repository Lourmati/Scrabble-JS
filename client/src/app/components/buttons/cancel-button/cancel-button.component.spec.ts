import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { Observable } from 'rxjs';
import { CancelButtonComponent } from './cancel-button.component';
import SpyObj = jasmine.SpyObj;

describe('CancelButtonComponent', () => {
    let component: CancelButtonComponent;
    let fixture: ComponentFixture<CancelButtonComponent>;
    let easelServiceSpy: SpyObj<EaselService>;
    beforeEach(async () => {
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['exchangeLetters', 'reset', 'getExchange']);
        easelServiceSpy.getExchange.and.returnValue(new Observable());
        await TestBed.configureTestingModule({
            declarations: [CancelButtonComponent],
            providers: [{ provide: EaselService, useValue: easelServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CancelButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should call reset of easelService', () => {
        component.cancelExchange();
        expect(easelServiceSpy.reset).toHaveBeenCalled();
    });
    it('should set onExchange to true', () => {
        component.handleExchange(true);
        expect(component.onExchange).toBeTrue();
    });
    it('should set onExchange to false', () => {
        component.handleExchange(false);
        expect(component.onExchange).toBeFalse();
    });
    it('isButtonActive should return false when is Not Currentplayer ', () => {
        component.isCurrentPlayer = false;
        expect(component.isButtonActive()).toBeFalse();
    });
    it('isButtonActive should return true when isCurrentplayer ', () => {
        component.isCurrentPlayer = true;
        expect(component.isButtonActive()).toBeFalse();
    });
    it('handleTurn should set isCurrrentPlayer to true ', () => {
        component.isCurrentPlayer = false;
        component.handleTurn(true);
        expect(component.isCurrentPlayer).toBeTrue();
    });
});
