/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { SidebarService } from './sidebar.service';
import SpyObj = jasmine.SpyObj;

describe('SidebarService', () => {
    let service: SidebarService;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    let sidebarSpy: SpyObj<SidebarComponent>;
    let mockSocket: SocketTestHelper;

    beforeEach(() => {
        mockSocket = new SocketTestHelper();
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['isSocketAlive', 'getId', 'on', 'emit', 'connect']);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        socketManagerServiceSpy.on.and.callFake((event: string, action: (data: any) => void) => mockSocket.on(event, action));
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: SidebarComponent, useValue: sidebarSpy },
            ],
        });
        service = TestBed.inject(SidebarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(socketManagerServiceSpy.connect).toHaveBeenCalled();
    });
    it('should call next callback when event sidebar:updated is emited', () => {
        service['registerEvent']();
        const spy = spyOn(service['sidebarInformations'], 'next');
        mockSocket.peerSideEmit('sidebar:updated');
        expect(spy).toHaveBeenCalled();
    });
});
