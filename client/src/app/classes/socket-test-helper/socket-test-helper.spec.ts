/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper/socket-test-helper';

describe('CanvasTestHelper', () => {
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: SocketTestHelper }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        });
        socketTestHelper = TestBed.inject(SocketTestHelper);
    });

    it('should be created', () => {
        expect(socketTestHelper).toBeTruthy();
    });

    it('Should add event to callback map when calling on and event not already in map', () => {
        const spySet = spyOn(socketTestHelper.callbacks, 'set');
        const spyGet = spyOn(socketTestHelper.callbacks, 'get');
        socketTestHelper.on('event', (data: unknown) => {});
        expect(spySet).toHaveBeenCalled();
        expect(spyGet).toHaveBeenCalledWith('event');
    });

    it('Should not add event to callback map when calling on and event already in map', () => {
        socketTestHelper.callbacks.set('event', []);
        const spySet = spyOn(socketTestHelper.callbacks, 'set');
        const spyGet = spyOn(socketTestHelper.callbacks, 'get');
        socketTestHelper.on('event', (data: unknown) => {});
        expect(spySet).not.toHaveBeenCalled();
        expect(spyGet).toHaveBeenCalledWith('event');
    });

    it('Should not add callback to map when event does not exist', () => {
        const spyGet = spyOn(socketTestHelper.callbacks, 'get').and.callThrough();
        socketTestHelper.on('event', (data: unknown) => {});
        expect(spyGet).toHaveBeenCalled();
        socketTestHelper.callbacks.clear();
    });

    it('Should do nothing on connect', () => {
        socketTestHelper.connect();
        expect(socketTestHelper).toBeTruthy();
    });

    it('Should do nothing on disconnect', () => {
        socketTestHelper.disconnect();
        expect(socketTestHelper).toBeTruthy();
    });

    it('Should do nothing on emit', () => {
        socketTestHelper.emit('event');
        expect(socketTestHelper).toBeTruthy();
    });
    it('Should do nothing on parsesideemit', () => {
        socketTestHelper.peerSideEmit('event');
        expect(socketTestHelper).toBeTruthy();
    });
});
