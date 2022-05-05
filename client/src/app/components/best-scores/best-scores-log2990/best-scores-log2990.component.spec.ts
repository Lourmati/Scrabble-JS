import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { ConnectionState } from '@app/constants/best-scores';
import { BestScoresService } from '@app/services/best-score/best-scores.service';
import { Observable, Subscriber } from 'rxjs';
import { BestScoresLOG2990Component } from './best-scores-log2990.component';

import SpyObj = jasmine.SpyObj;
describe('BestScoresLOG2990 Component', () => {
    let component: BestScoresLOG2990Component;
    let fixture: ComponentFixture<BestScoresLOG2990Component>;
    let bestScoresServiceSpy: SpyObj<BestScoresService>;

    beforeEach(async () => {
        bestScoresServiceSpy = jasmine.createSpyObj('BestScoresService', ['getScoreByPlayerMode', 'getBestScores']);
        bestScoresServiceSpy.isScoresAvailable = ConnectionState.Available;
        bestScoresServiceSpy.isServerAvailable = ConnectionState.Available;
        bestScoresServiceSpy.getBestScores.and.returnValue(
            new Observable<BestScore[]>((subscriber: Subscriber<BestScore[]>) => {
                subscriber.next([
                    { name: ['player1'], score: 1, playerMode: 'Classique' },
                    { name: ['player2'], score: 2, playerMode: 'Classique' },
                ]);
            }),
        );
        await TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: BestScoresService, useValue: bestScoresServiceSpy }],
            declarations: [BestScoresLOG2990Component],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BestScoresLOG2990Component);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(bestScoresServiceSpy.getBestScores).toHaveBeenCalled();
        expect(bestScoresServiceSpy.getScoreByPlayerMode).toHaveBeenCalled();
    });

    it('should return score availability state when getScoresAvailability is called', () => {
        component.getScoresAvailability();
        expect(component.getScoresAvailability()).toBe('Available');
    });

    it('should return server availability state when getServerAvailability is called', () => {
        component.getServerAvailability();
        expect(component.getScoresAvailability()).toBe('Available');
    });
});
