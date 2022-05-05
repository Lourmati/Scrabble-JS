/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { GameDisplayService } from './game-display.service';

import SpyObj = jasmine.SpyObj;

describe('GameDisplayService', () => {
    let service: GameDisplayService;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let mockSocket: SocketTestHelper;

    beforeEach(() => {
        mockSocket = new SocketTestHelper();
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['isSocketAlive', 'on', 'connect']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socketManagerServiceSpy.on.and.callFake((event: string, action: (data: any) => void) => mockSocket.on(event, action));
        TestBed.configureTestingModule({
            providers: [{ provide: SocketManagerService, useValue: socketManagerServiceSpy }],
        });
        service = TestBed.inject(GameDisplayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call registerEvents', () => {
        service['registerEvents'] = jasmine.createSpy();
        service['registerEvents']();
        expect(service['registerEvents']).toHaveBeenCalled();
    });
    it('should call next callback when event updateGrid is emited', () => {
        service['registerEvents']();
        const spy = spyOn(service.gridUpdate, 'next');
        mockSocket.peerSideEmit('grid:updated');
        expect(spy).toHaveBeenCalled();
    });
    it('should call next callback when event updateEasel is emited', () => {
        service['registerEvents']();
        const spy = spyOn(service.easelUpdate, 'next');
        mockSocket.peerSideEmit('easel:updated');
        expect(spy).toHaveBeenCalled();
    });
});
