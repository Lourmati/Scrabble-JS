import { TestBed } from '@angular/core/testing';
import { AXIS } from '@app/classes/grid/placement';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { CommandService } from '@app/services/command/command.service';

import SpyObj = jasmine.SpyObj;

describe('CommandService', () => {
    let chatboxServiceSpy: SpyObj<ChatboxService>;
    let service: CommandService;

    beforeEach(() => {
        chatboxServiceSpy = jasmine.createSpyObj('ChatboxService', ['emitMessage']);
        TestBed.configureTestingModule({
            providers: [{ provide: ChatboxService, useValue: chatboxServiceSpy }],
        });
        service = TestBed.inject(CommandService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should run place command', () => {
        const spy = spyOn(service, 'getPlaceCommand').and.callThrough();
        service.place({
            pos: { x: 2, y: 3 },
            direction: AXIS.Horizontal,
            value: 'A',
        });
        expect(spy).toHaveBeenCalled();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalledWith('!placer c2h A');
    });

    it('Should run place command', () => {
        const spy = spyOn(service, 'getPlaceCommand').and.callThrough();
        service.place({
            pos: { x: 1, y: 1 },
            direction: AXIS.Vertical,
            value: 'BC',
        });
        expect(spy).toHaveBeenCalled();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalledWith('!placer a1v BC');
    });

    it('Should run exchange command', () => {
        const spy = spyOn(service, 'getExchangeCommand').and.callThrough();
        service.exchange([
            { letter: 'A', point: 2 },
            { letter: 'B', point: 2 },
            { letter: 'C', point: 3 },
        ]);
        expect(spy).toHaveBeenCalled();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalledWith('!échanger abc');
    });

    it('Should run exchange command', () => {
        const spy = spyOn(service, 'getExchangeCommand').and.callThrough();
        service.exchange([]);
        expect(spy).toHaveBeenCalled();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalledWith('!échanger ');
    });

    it('Should return place command', () => {
        expect(
            service.getPlaceCommand({
                pos: { x: 2, y: 3 },
                direction: AXIS.Horizontal,
                value: 'A',
            }),
        ).toEqual('!placer c2h A');
    });

    it('Should return place command', () => {
        expect(
            service.getPlaceCommand({
                pos: { x: 1, y: 1 },
                direction: AXIS.Vertical,
                value: 'BC',
            }),
        ).toEqual('!placer a1v BC');
    });

    it('Should return exchange command', () => {
        expect(service.getExchangeCommand('ABC')).toEqual('!échanger ABC');
    });

    it('Should return exchange command', () => {
        expect(service.getExchangeCommand('')).toEqual('!échanger ');
    });

    it('Should return vector from position', () => {
        expect(service.vectorToPosition({ x: 2, y: 3 })).toEqual('c2');
    });

    it('Should return vector from position', () => {
        expect(service.vectorToPosition({ x: 1, y: 1 })).toEqual('a1');
    });

    it('Should return orientation from direction', () => {
        expect(service.directionToOrientation(AXIS.Horizontal)).toEqual('h');
    });

    it('Should return orientation from direction', () => {
        expect(service.directionToOrientation(AXIS.Vertical)).toEqual('v');
    });
});
