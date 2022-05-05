/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { ObjectivesControllerService } from './objectives-controller.service';
import SpyObj = jasmine.SpyObj;
const NUMBER_OF_CALLS = 4;
const MOCK_OBJECTIVE = {
    id: '',
    title: 'Maitre des voyelles',
    description: 'Placer un mot avec 4 voyelles',
    points: 30,
    type: ObjectiveType.PUBLIC,
    checked: false,
    done: false,
    code: 1,
};
describe('ObjectivesControllerService', () => {
    let service: ObjectivesControllerService;
    // let publicObjectives: SpyObj<Subject<Objective[]>>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    beforeEach(() => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['emit', 'on']);
        TestBed.configureTestingModule({ providers: [{ provide: SocketManagerService, useValue: socketManagerServiceSpy }] });
        // publicObjectives = jasmine.createSpyObj('Subject', ['next', 'asObservable']);
        service = TestBed.inject(ObjectivesControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('Should handle public objective update when calling handlePublicObjectives', () => {
        const spy = spyOn(service.publicObjectives, 'next');
        service.handlePublicObjectivesUpdate([]);
        expect(spy).toHaveBeenCalledOnceWith([]);
    });
    it('Should handle private objective update when calling handlePublicObjectives', () => {
        const spy = spyOn(service.privateObjective, 'next');
        service.handlePrivateObjectiveUpdate(MOCK_OBJECTIVE);
        expect(spy).toHaveBeenCalledOnceWith(MOCK_OBJECTIVE);
    });
    it('Should return public objectives observable when calling getPublicObjectives', () => {
        expect(service.getPublicObjectives()).toEqual(service['publicObjectives'].asObservable());
    });
    it('Should return private objectives observable when calling getPublicObjectives', () => {
        expect(service.getPrivateObjectives()).toEqual(service['privateObjective'].asObservable());
    });
    it('Should handle events when calling handleEvents', () => {
        service.handleEvents();
        expect(socketManagerServiceSpy.on).toHaveBeenCalledTimes(NUMBER_OF_CALLS);
    });
});
