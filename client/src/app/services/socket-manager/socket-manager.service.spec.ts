/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Socket } from 'socket.io-client';

/*
    
    Utilisation de cas de test écris par Nikolay Radoev (https://gitlab.com/nikolayradoev)
    https://gitlab.com/nikolayradoev/socket-io-exemple/-/blob/master/client/src/app/services/socket-client.service.spec.ts
    
*/

describe('SocketManagerService', () => {
    let service: SocketManagerService;
    let mockId: string;

    beforeEach(() => {
        mockId = 'id';
        TestBed.configureTestingModule({});
        service = TestBed.inject(SocketManagerService);
        service['socket'] = new SocketTestHelper() as unknown as Socket;
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('isSocketAlive should return true if the socket is still connected', () => {
        service['socket'].connected = true;
        expect(service.isSocketAlive()).toBeTruthy();
    });

    it('isSocketAlive should return false if the socket is no longer connected', () => {
        service['socket'].connected = false;
        expect(service.isSocketAlive()).toBeFalsy();
    });

    it('isSocketAlive should return false if the socket is not defined', () => {
        (service['socket'] as unknown) = undefined;
        expect(service.isSocketAlive()).toBeFalsy();
    });

    it('Should return the id of the socket when the socket is still connected', () => {
        service['socket'].connected = true;
        service['socket'].id = mockId;
        expect(service.getId()).toBe(mockId);
    });

    it('Should disconnect socket when calling disconnect', () => {
        const spy = spyOn(service['socket'], 'disconnect');
        service.disconnect();
        expect(spy).toHaveBeenCalled();
    });

    it('Should call socket.on with an event', () => {
        const event = 'helloWorld';
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const action = () => {};
        const spy = spyOn(service['socket'], 'on');
        service.on(event, action);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, action);
    });

    it('Should call emit with data when using emit', () => {
        const event = 'helloWorld';
        const data = 42;
        const spy = spyOn(service['socket'], 'emit');
        service.emit(event, data);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, data);
    });
    it('Should call emit with second data when using emit', () => {
        const event = 'helloWorld';
        const data = 42;
        const secondData = 'secondParam';
        const spy = spyOn(service['socket'], 'emit');
        service.emit(event, data, secondData);
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(event, data, secondData);
    });

    /*
        Les deux tests suivant servent uniquement à assurer une couverture
        de code et de branche de 100% sur la méthode connect du service.
    */

    it('Should connect socket when socket is not connected', () => {
        service['socket'].connected = false;
        service.connect();
        expect(service['socket'] instanceof Socket).toBeTrue();
    });

    it('Should stay connected  when socket is already connected', () => {
        service['socket'].connected = true;
        service.connect();
        expect(service['socket'].connected).toBeTrue();
    });
});
