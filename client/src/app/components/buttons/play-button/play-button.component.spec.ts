import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { PlayButtonComponent } from './play-button.component';
import SpyObj = jasmine.SpyObj;

describe('PlayButtonComponent', () => {
    let component: PlayButtonComponent;
    let fixture: ComponentFixture<PlayButtonComponent>;
    let gridManager: SpyObj<GridManagerService>;

    beforeEach(async () => {
        gridManager = jasmine.createSpyObj('GridManagerService', ['handleEnter']);
        await TestBed.configureTestingModule({
            declarations: [PlayButtonComponent],
            providers: [{ provide: GridManagerService, useValue: gridManager }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('play should call handle Enter from the gridManagerService', () => {
        const spy = gridManager.handleEnter;
        component.play();
        expect(spy).toHaveBeenCalled();
    });
});
