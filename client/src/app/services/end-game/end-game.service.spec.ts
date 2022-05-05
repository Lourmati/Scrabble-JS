/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Observable } from 'rxjs';
const MOCK_PLAYER_SCORE = [
    { player: { id: '', name: '' }, score: 0 },
    { player: { id: '', name: '' }, score: 0 },
];

describe('EndGameService', () => {
    let service: EndGameService;
    let socketMangerServiceSpy: jasmine.SpyObj<SocketManagerService>;

    beforeEach(() => {
        socketMangerServiceSpy = jasmine.createSpyObj(SocketManagerService, ['connect', 'on', 'getId']);
        socketMangerServiceSpy.getId.and.returnValue('id');
        TestBed.configureTestingModule({
            providers: [{ provide: SocketManagerService, useValue: socketMangerServiceSpy }],
        });
        service = TestBed.inject(EndGameService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
        expect(socketMangerServiceSpy.connect).toHaveBeenCalled();
    });

    it('Should listen on event', () => {
        service['registerEvent']();
        expect(socketMangerServiceSpy.on).toHaveBeenCalled();
    });

    it('Should return content', () => {
        expect(service.getContent()).toBeInstanceOf(Observable);
    });

    it('Should handle end game', () => {
        const computeContentSpy = spyOn(service, 'computeContent' as keyof EndGameService);
        const nextSpy = spyOn(service['content'], 'next');
        service['handleEndGame'](MOCK_PLAYER_SCORE);
        expect(computeContentSpy).toHaveBeenCalled();
        expect(nextSpy).toHaveBeenCalled();
    });

    it('Should compute content', () => {
        expect(
            service['computeContent']([
                { player: { id: 'id', name: 'name' }, score: 10 },
                { player: { id: 'bad_id', name: 'name' }, score: 0 },
            ]),
        ).toEqual('Félicitations ! Vous avez gagné la partie !');
    });

    it('Should compute content', () => {
        expect(
            service['computeContent']([
                { player: { id: 'bad_id', name: 'name' }, score: 0 },
                { player: { id: 'id', name: 'name' }, score: 10 },
            ]),
        ).toEqual('Félicitations ! Vous avez gagné la partie !');
    });

    it('Should compute content', () => {
        expect(
            service['computeContent']([
                { player: { id: 'id', name: 'name' }, score: 10 },
                { player: { id: 'bad_id', name: 'name' }, score: 10 },
            ]),
        ).toEqual('Égalité ! Bien joué !');
    });

    it('Should compute content', () => {
        expect(
            service['computeContent']([
                { player: { id: 'id', name: 'name' }, score: 0 },
                { player: { id: 'bad_id', name: 'name' }, score: 10 },
            ]),
        ).toEqual('Vous avez perdu la partie. Une revanche ?');
    });
});
