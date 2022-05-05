import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassTurnService } from '@app/services/pass-turn/pass-turn.service';
import { BehaviorSubject } from 'rxjs';
import { PassButtonComponent } from './pass-button.component';
import SpyObj = jasmine.SpyObj;

describe('PassButtonComponent', () => {
    let component: PassButtonComponent;
    let fixture: ComponentFixture<PassButtonComponent>;
    let passTurnServiceSpy: SpyObj<PassTurnService>;
    let isCurrentPlayer: BehaviorSubject<boolean>;

    beforeEach(() => {
        isCurrentPlayer = new BehaviorSubject<boolean>(false);
        passTurnServiceSpy = jasmine.createSpyObj('PassTurnService', ['passTurn', 'isCurrentPlayer']);
        passTurnServiceSpy.isCurrentPlayer.and.returnValue(isCurrentPlayer.asObservable());
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [{ provide: PassTurnService, useValue: passTurnServiceSpy }],
            declarations: [PassButtonComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PassButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should get the current player', () => {
        component.isCurrentPlayer = false;
        isCurrentPlayer.next(true);
        expect(component.isCurrentPlayer).toBe(true);
    });

    it('Should call passTurn of pass turn service', () => {
        component.passTurn();
        expect(passTurnServiceSpy.passTurn).toHaveBeenCalled();
    });
});
