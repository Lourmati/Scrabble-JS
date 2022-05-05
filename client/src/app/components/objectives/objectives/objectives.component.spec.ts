/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { ObjectivesControllerService } from '@app/services/objectives/objectives-controller.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject } from 'rxjs';
import { ObjectivesComponent } from './objectives.component';
import SpyObj = jasmine.SpyObj;
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
const MOCK_PRIVATE_OBJECTIVE = {
    id: '',
    title: 'Maitre des voyelles',
    description: 'Placer un mot avec 4 voyelles',
    points: 30,
    type: ObjectiveType.PRIVATE,
    checked: false,
    done: false,
    code: 1,
};
describe('ObjectivesComponent', () => {
    let component: ObjectivesComponent;
    let objectiveControllerSpy: SpyObj<ObjectivesControllerService>;
    let fixture: ComponentFixture<ObjectivesComponent>;
    let socketManagerServiceSpy: SpyObj<SocketManagerService>;
    beforeEach(async () => {
        socketManagerServiceSpy = jasmine.createSpyObj('SocketManagerService', ['on', 'connect']);
        objectiveControllerSpy = jasmine.createSpyObj('ObjectivesControllerService', ['handleEvents', 'getPublicObjectives', 'getPrivateObjectives']);
        objectiveControllerSpy.handleEvents.and.callThrough();

        socketManagerServiceSpy.on.and.callThrough();
        objectiveControllerSpy.getPrivateObjectives.and.returnValue(new BehaviorSubject<Objective>(MOCK_PRIVATE_OBJECTIVE).asObservable());
        objectiveControllerSpy.getPublicObjectives.and.returnValue(new BehaviorSubject<Objective[]>([MOCK_OBJECTIVE]).asObservable());
        await TestBed.configureTestingModule({
            declarations: [ObjectivesComponent],
            providers: [
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: ObjectivesControllerService, useValue: objectiveControllerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectivesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('handlePublicObjectivesUpdate should copy publicObjectives', () => {
        component.publicObjectives = [{} as Objective];
        component.handlePublicObjectivesUpdate([MOCK_OBJECTIVE]);
        expect(component.publicObjectives).toEqual([MOCK_OBJECTIVE]);
    });
    it('handlePrivateObjectivesUpdate should copy publicObjectives', () => {
        component.publicObjectives = [{} as Objective];
        component.handlePrivateObjectivesUpdate(MOCK_PRIVATE_OBJECTIVE);
        expect(component.privateObjective).toEqual(MOCK_PRIVATE_OBJECTIVE);
    });
});
