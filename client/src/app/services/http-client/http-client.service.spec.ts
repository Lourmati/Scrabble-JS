import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientService } from '@app/services/http-client/http-client.service';
import { Observable } from 'rxjs';

describe('HttpClientService', () => {
    let service: HttpClientService;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        httpClientSpy.get.and.returnValue(new Observable());
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: httpClientSpy }],
        });
        service = TestBed.inject(HttpClientService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call http get when getBestScores is called with classic mode', () => {
        service.getBestScores('Classique');
        expect(httpClientSpy.get).toHaveBeenCalled();
    });
    it('should call http get when getBestScores is called with Log2990 mode', () => {
        service.getBestScores('Log2990');
        expect(httpClientSpy.get).toHaveBeenCalled();
    });
    it('should call http get when getGameHistory is called', () => {
        service.getGameHistory();
        expect(httpClientSpy.get).toHaveBeenCalled();
    });
    it('should call http get when getGameHistory is called', () => {
        service.getGameHistory();
        expect(httpClientSpy.get).toHaveBeenCalled();
    });

    it('should throw error when handle error is called', () => {
        // eslint-disable-next-line dot-notation
        expect(service['handleError']).toThrowError();
    });
});
