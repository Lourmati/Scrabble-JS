import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SurrenderButtonComponent } from './surrender-button.component';

describe('SurrenderButtonComponent', () => {
    let component: SurrenderButtonComponent;
    let fixture: ComponentFixture<SurrenderButtonComponent>;

    let matDialogSpy: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialogSpy = jasmine.createSpyObj(MatDialog, ['open']);
        await TestBed.configureTestingModule({
            declarations: [SurrenderButtonComponent],
            providers: [{ provide: MatDialog, useValue: matDialogSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurrenderButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should call surrender when clicking on button', () => {
        const surrenderButton: HTMLElement = fixture.nativeElement.querySelector('button');
        const spy = spyOn(component, 'surrender');
        surrenderButton.click();
        expect(spy).toHaveBeenCalled();
    });

    it('Should open the dialog', () => {
        component.surrender();
        expect(matDialogSpy.open).toHaveBeenCalled();
    });
});
