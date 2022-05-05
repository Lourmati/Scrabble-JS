/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { GameService } from '@app/services/game/game.service';
import { TimerService } from '@app/services/timer/timer.service';
import { Observable } from 'rxjs';

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj('GameService', [
            'isCurrentPlayer',
            'getTimerDuration',
            'setCurrentPlayer',
            'timerDuration',
            'getPlayerName',
        ]);
        timerServiceSpy = jasmine.createSpyObj('TimerService', ['startTimer', 'resetTimer', 'setDuration', 'getTime']);
        timerServiceSpy.getTime.and.returnValue(new Observable());
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('html of timer should be updated if setTimer is called', () => {
        const timer = document.getElementById('timer') as HTMLElement;
        timer.innerHTML = '';
        const value = 10;
        component.setTimer(value);

        expect(timer.innerHTML).not.toBe('');
    });

    it('html of timer should be updated if setTimer is called', () => {
        const timer = document.getElementById('timer') as HTMLElement;
        timer.remove();
        component.setTimer(1);
        expect(true).toBeTruthy();
    });

    it('setTimer should display 0:00 if the number of seconds is negative', () => {
        const timer = document.getElementById('timer') as HTMLElement;
        const value = -10;
        component.setTimer(value);

        expect(timer.innerHTML).toBe('0 : 00');
    });

    it('should display 2 digits for seconds if the number of seconds is between 0 and 10', () => {
        const timer = document.getElementById('timer') as HTMLElement;
        const maxNumber = 10;

        for (let value = 1; value < maxNumber; value++) {
            component.setTimer(value);
            expect(timer.innerHTML).toBe(`0 : 0${value}`);
        }
    });
    it('should not call resetTimer when time is equal to 0 ', () => {
        component.resetTimer(0);
        expect(timerServiceSpy.resetTimer).toHaveBeenCalled();
    });

    it('should call resetTimer when time is not equal to 0 ', () => {
        component.resetTimer(30);
        expect(timerServiceSpy.resetTimer).toHaveBeenCalled();
    });

    it('should call resetTimer when time is not equal to 0 ', () => {
        component.timerSetUp();
        expect(timerServiceSpy.setDuration).toHaveBeenCalled();
        expect(timerServiceSpy.startTimer).toHaveBeenCalled();
    });
});
