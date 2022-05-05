/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { ENDPOINT_DICTIONARY, ENDPOINT_GAME_HISTORY, ENDPOINT_VIRTUAL_PLAYER_NAMES } from '@app/constants/admin';
import { BEST_SCORES_RESET_ENDPOINT } from '@app/constants/best-scores';
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AdminService } from './admin.service';

describe('AdminService', () => {
    let service: AdminService;
    let httpTestingController: HttpTestingController;
    let httpClientStub: jasmine.SpyObj<HttpClient>;

    beforeEach(() => {
        httpClientStub = jasmine.createSpyObj(HttpClient, ['get', 'post', 'patch', 'delete']);
        httpClientStub.get.and.returnValue(from([[]]));

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(AdminService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should get the dictionnaries', () => {
        service.getDictionaries().subscribe((dictionaries) => expect(dictionaries).toEqual([]));
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY);
        expect(req.request.method).toEqual('GET');
        req.flush([]);
    });

    it('Should add the dictionnary', () => {
        service.addDictionary(new FormData()).subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY);
        expect(req.request.method).toEqual('POST');
        req.flush('', { status: 201, statusText: 'Created' });
    });

    it('Should add the dictionnary', () => {
        service.addDictionary(new FormData()).subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY);
        expect(req.request.method).toEqual('POST');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should edit the dictionnary', () => {
        service.editDictionary({ title: 'title', filename: 'filename', description: 'description' }).subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY);
        expect(req.request.method).toEqual('PATCH');
        req.event(new HttpResponse({ status: 200, statusText: 'OK', body: '' }));
    });

    it('Should edit the dictionnary', () => {
        service.editDictionary({ title: 'title', filename: 'filename', description: 'description' }).subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY);
        expect(req.request.method).toEqual('PATCH');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should delete the dictionnary', () => {
        service.deleteDictionary('filename').subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY + '/filename');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should delete the dictionnary', () => {
        service.deleteDictionary('filename').subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY + '/filename');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should reset the dictionnary', () => {
        service.resetDictionary().subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY + '/reset');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should reset the dictionnary', () => {
        service.resetDictionary().subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_DICTIONARY + '/reset');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should get the names', () => {
        service.getVirtualPlayerNames().subscribe((names) => expect(names).toEqual({ beginner: [], expert: [] }));
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
        expect(req.request.method).toEqual('GET');
        req.flush({ beginner: [], expert: [] });
    });

    it('Should add the name', () => {
        service.addVirtualPlayerName('name', VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
        expect(req.request.method).toEqual('POST');
        req.event(new HttpResponse({ status: 201, statusText: 'Created', body: '' }));
    });

    it('Should add the name', () => {
        service.addVirtualPlayerName('name', VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
        expect(req.request.method).toEqual('POST');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should edit the name', () => {
        service.editVirtualPlayerName(0, 'name', VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
        expect(req.request.method).toEqual('PATCH');
        req.event(new HttpResponse({ status: 200, statusText: 'OK', body: '' }));
    });

    it('Should edit the name', () => {
        service.editVirtualPlayerName(0, 'name', VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
        expect(req.request.method).toEqual('PATCH');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should delete the name', () => {
        service.deleteVirtualPlayerName(0, VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + '/0/0');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should delete the name', () => {
        service.deleteVirtualPlayerName(0, VirtualPlayerLevel.BEGINNER).subscribe((data) => expect(data).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + '/0/0');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 400, statusText: 'Bad request' });
    });

    it('Should get the game history', () => {
        service.getGameHistory().subscribe((gameHistory) => expect(gameHistory).toEqual([]));
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_GAME_HISTORY);
        expect(req.request.method).toEqual('GET');
        req.flush([]);
    });

    it('Should reset the game history', () => {
        service.resetGameHistory().subscribe((status) => expect(status).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_GAME_HISTORY);
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should reset the game history', () => {
        service.resetGameHistory().subscribe((status) => expect(status).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_GAME_HISTORY);
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 404, statusText: 'Not found' });
    });

    it('Should delete game history', () => {
        service.deleteGameHistory('id').subscribe((status) => expect(status).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_GAME_HISTORY + '/id');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should delete game history', () => {
        service.deleteGameHistory('id').subscribe((status) => expect(status).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_GAME_HISTORY + '/id');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 404, statusText: 'Not found' });
    });

    it('Should reset the names', () => {
        service.resetVirtualPlayerName().subscribe((status) => expect(status).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + '/reset');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 404, statusText: 'Not found' });
    });

    it('Should reset the names', () => {
        service.resetVirtualPlayerName().subscribe((status) => expect(status).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + '/reset');
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should reset the best scores', () => {
        service.resetBestScores().subscribe((status) => expect(status).toBeTruthy());
        const req = httpTestingController.expectOne(environment.serverUrl + BEST_SCORES_RESET_ENDPOINT);
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 200, statusText: 'OK' });
    });

    it('Should reset the best scores', () => {
        service.resetBestScores().subscribe((status) => expect(status).toBeFalsy());
        const req = httpTestingController.expectOne(environment.serverUrl + BEST_SCORES_RESET_ENDPOINT);
        expect(req.request.method).toEqual('DELETE');
        req.flush('', { status: 404, statusText: 'Not found' });
    });
});
