import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BEST_SCORE_RESET_FAILURE, BEST_SCORE_RESET_SUCCESS } from '@app/constants/admin';
import { BestScoresService } from '@app/services/best-score/best-scores.service';
import { from } from 'rxjs';

import { AdminBestScoresComponent } from './admin-best-scores.component';

describe('AdminBestScoresComponent', () => {
    let component: AdminBestScoresComponent;
    let fixture: ComponentFixture<AdminBestScoresComponent>;
    let bestScoresServiceStub: jasmine.SpyObj<BestScoresService>;
    let matSnackBarStub: jasmine.SpyObj<MatSnackBar>;

    beforeEach(async () => {
        bestScoresServiceStub = jasmine.createSpyObj(BestScoresService, ['getBestScores', 'getScoreByPlayerMode', 'resetScore']);
        matSnackBarStub = jasmine.createSpyObj(MatSnackBar, ['open']);

        bestScoresServiceStub.getBestScores.and.returnValue(from([[]]));
        bestScoresServiceStub.resetScore.and.returnValue(from([true]));

        await TestBed.configureTestingModule({
            declarations: [AdminBestScoresComponent],
            providers: [
                { provide: BestScoresService, useValue: bestScoresServiceStub },
                { provide: MatSnackBar, useValue: matSnackBarStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminBestScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should update', () => {
        bestScoresServiceStub.getBestScores.and.returnValue(from([[]]));
        component.update();
        expect(component.bestScores.classic).toHaveSize(0);
        expect(component.bestScores.log2990).toHaveSize(0);
    });

    it('Should update', () => {
        bestScoresServiceStub.getBestScores.and.returnValue(
            from([
                [
                    {
                        name: ['SATOSHI'],
                        score: 500,
                        playerMode: 'Classique',
                    },
                ],
            ]),
        );
        component.update();
        expect(component.bestScores.classic).toHaveSize(1);
        expect(component.bestScores.log2990).toHaveSize(0);
    });

    it('Should reset on service', () => {
        bestScoresServiceStub.resetScore.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.reset();
        expect(bestScoresServiceStub.resetScore).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(BEST_SCORE_RESET_SUCCESS, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should reset on service', () => {
        bestScoresServiceStub.resetScore.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.reset();
        expect(bestScoresServiceStub.resetScore).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(BEST_SCORE_RESET_FAILURE, 'OK', { duration: 3000 });
        expect(spy).not.toHaveBeenCalled();
    });
});
