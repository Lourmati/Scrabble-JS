import { TestBed } from '@angular/core/testing';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import { MOCK_GAME_CLASSIQUE } from '@app/constants/game-history';
import { HttpClientService } from '@app/services/http-client/http-client.service';
import { Subject } from 'rxjs';
import { GameHistoryService } from './game-history.service';
import SpyObj = jasmine.SpyObj;

describe('GameHistoryService', () => {
    let service: GameHistoryService;
    let httpSpy: SpyObj<HttpClientService>;
    let subjectStub: Subject<GameHistory[]>;

    beforeEach(() => {
        subjectStub = new Subject();
        subjectStub.next([MOCK_GAME_CLASSIQUE]);
        httpSpy = jasmine.createSpyObj('HttpService', ['getGameHistory']);
        httpSpy.getGameHistory.and.resolveTo();
        httpSpy.getGameHistory.and.returnValue(subjectStub.asObservable());
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClientService, useValue: httpSpy }],
        });
        service = TestBed.inject(GameHistoryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('handle game history should call next to update game history', () => {
        const spy = spyOn(service.gameHistory, 'next');
        service.handleGameHistory([]);
        expect(spy).toHaveBeenCalled();
    });

    it('should be call asObservable of getGameHistoryObs ', () => {
        const spy = spyOn(service.gameHistory, 'asObservable');
        service.getGameHistoryObs();
        expect(spy).toHaveBeenCalled();
    });

    it('call http getGameHistory when getGameHistory is called', () => {
        service.getGameHistory();
        expect(httpSpy.getGameHistory).toHaveBeenCalled();
    });
});
