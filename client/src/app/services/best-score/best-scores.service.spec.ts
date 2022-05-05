import { TestBed } from '@angular/core/testing';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { ConnectionState } from '@app/constants/best-scores';
import { AdminService } from '@app/services/admin/admin.service';
import { HttpClientService } from '@app/services/http-client/http-client.service';
import { BehaviorSubject, from, Subject } from 'rxjs';
import { BestScoresService } from './best-scores.service';

import SpyObj = jasmine.SpyObj;
const SCORE = {
    name: ['SATOSHI'],
    score: 500,
    playerMode: 'Classique',
};

describe('BestScoresService', () => {
    let service: BestScoresService;
    let httpSpy: SpyObj<HttpClientService>;
    let subjectStub: Subject<BestScore[]>;
    let adminServiceStub: SpyObj<AdminService>;

    beforeEach(() => {
        subjectStub = new Subject();
        subjectStub.next([SCORE]);
        adminServiceStub = jasmine.createSpyObj('AdminService', ['resetBestScores']);
        httpSpy = jasmine.createSpyObj('HttpService', ['getBestScores']);
        httpSpy.getBestScores.and.resolveTo();
        httpSpy.getBestScores.and.returnValue(subjectStub.asObservable());
        TestBed.configureTestingModule({
            providers: [
                { provide: HttpClientService, useValue: httpSpy },
                { provide: AdminService, useValue: adminServiceStub },
            ],
        });
        service = TestBed.inject(BestScoresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('handle new score should call next to update scores', () => {
        const spy = spyOn(service.bestScores, 'next');
        service.handleNewBestScore([]);
        expect(spy).toHaveBeenCalled();
    });

    it('should be call asObservable of bestScores ', () => {
        const spy = spyOn(service.bestScores, 'asObservable');
        service.getBestScores();
        expect(spy).toHaveBeenCalled();
    });

    it('call http get Current when player mode is classique', () => {
        httpSpy.getBestScores.and.returnValue(from([[SCORE]]));
        service.getScoreByPlayerMode('Classique');
        expect(httpSpy.getBestScores).toHaveBeenCalled();
    });

    it('call http get Current when player mode is classique', () => {
        httpSpy.getBestScores.and.returnValue(from([[undefined as unknown as BestScore]]));
        service.getScoreByPlayerMode('Classique');
        expect(httpSpy.getBestScores).toHaveBeenCalled();
    });

    it('call http get Current when player mode is classique', () => {
        service.getScoreByPlayerMode('Classique');
        expect(httpSpy.getBestScores).toHaveBeenCalled();
    });

    it('not call http get Current when player mode is classique', () => {
        service.getScoreByPlayerMode('LOG2990');
        expect(httpSpy.getBestScores).toHaveBeenCalled();
    });

    it('Should reset best scores', () => {
        service.resetScore();
        expect(adminServiceStub.resetBestScores).toHaveBeenCalled();
    });

    it('Should call handleNewBestScore when getScoreByPlayerMode', () => {
        const bestScoreObs = new BehaviorSubject([]).asObservable();
        spyOn(service, 'handleNewBestScore');
        httpSpy.getBestScores.and.returnValue(bestScoreObs);
        service.getScoreByPlayerMode('Classique');
        expect(service.handleNewBestScore).toHaveBeenCalled();
    });

    it('Should throw an exception when server is not connected', () => {
        const bestScoreObs = new BehaviorSubject([]);
        bestScoreObs.error('');
        spyOn(service, 'handleNewBestScore');
        httpSpy.getBestScores.and.returnValue(bestScoreObs);
        service.getScoreByPlayerMode('Classique');
        expect(service.isScoresAvailable).toBe(ConnectionState.NotAvailable);
    });
});
