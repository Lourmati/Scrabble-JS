/* eslint-disable dot-notation */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { EndGameComponent } from '@app/components/end-game/end-game.component';
import { EndGameService } from '@app/services/end-game/end-game.service';
import { Subject } from 'rxjs';

describe('EndGameComponent', () => {
    let component: EndGameComponent;
    let fixture: ComponentFixture<EndGameComponent>;
    let endGameServiceSpy: jasmine.SpyObj<EndGameService>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        endGameServiceSpy = jasmine.createSpyObj('EndGameService', ['getContent']);
        endGameServiceSpy.getContent.and.returnValue(new Subject<string>());
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            declarations: [EndGameComponent],
            providers: [
                { provide: EndGameService, useValue: endGameServiceSpy },
                { provide: MatDialog, useValue: matDialogSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EndGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(endGameServiceSpy.getContent).toHaveBeenCalled();
    });

    it('Should open dialog with the right content', () => {
        component['handleStatusUpdate']('status');
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});
