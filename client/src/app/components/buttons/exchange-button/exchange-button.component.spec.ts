import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { Observable } from 'rxjs';
import { ExchangeButtonComponent } from './exchange-button.component';
import SpyObj = jasmine.SpyObj;

describe('ExchangeButtonComponent', () => {
    let component: ExchangeButtonComponent;
    let fixture: ComponentFixture<ExchangeButtonComponent>;
    let easelServiceSpy: SpyObj<EaselService>;

    beforeEach(async () => {
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['exchangeLetters', 'reset', 'getExchange']);
        easelServiceSpy.getExchange.and.returnValue(new Observable());
        await TestBed.configureTestingModule({
            declarations: [ExchangeButtonComponent],
            providers: [{ provide: EaselService, useValue: easelServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call exchangeLetters of EaselService', () => {
        component.exchange();
        expect(easelServiceSpy.exchangeLetters).toHaveBeenCalled();
    });
    it('should set onExchange to true', () => {
        component.handleExchange(true);
        expect(component.onExchange).toBeTrue();
    });
    it('should set onExchange to false', () => {
        component.handleExchange(false);
        expect(component.onExchange).toBeFalse();
    });
    it('handleTurn should set isCurrrentPlayer to true ', () => {
        component.isCurrentPlayer = false;
        component.handleTurn(true);
        expect(component.isCurrentPlayer).toBeTrue();
    });
});
