import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { HighScoresPageComponent } from './high-scores-page.component';

describe('HighScoresPageComponent', () => {
    let component: HighScoresPageComponent;
    let fixture: ComponentFixture<HighScoresPageComponent>;
    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
            declarations: [HighScoresPageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HighScoresPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call open of dialog when openScoresClassique is called', () => {
        component.openScoresClassique();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });

    it('should call open of dialog when openScoresLOG2990 is called', () => {
        component.openScoresLOG2990();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});
