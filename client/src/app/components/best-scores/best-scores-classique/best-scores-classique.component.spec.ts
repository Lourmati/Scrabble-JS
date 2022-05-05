import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { ConnectionState } from '@app/constants/best-scores';
import { BestScoresService } from '@app/services/best-score/best-scores.service';
import { Observable, Subscriber } from 'rxjs';
import { BestScoresClassiqueComponent } from './best-scores-classique.component';

import SpyObj = jasmine.SpyObj;

describe('BestScoresClassique cComponent', () => {
    let component: BestScoresClassiqueComponent;
    let fixture: ComponentFixture<BestScoresClassiqueComponent>;
    let bestScoresServiceSpy: SpyObj<BestScoresService>;

    beforeEach(async () => {
        bestScoresServiceSpy = jasmine.createSpyObj('BestScoresService', ['getBestScores', 'getScoreByPlayerMode']);
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
            declarations: [BestScoresClassiqueComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BestScoresClassiqueComponent);
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
