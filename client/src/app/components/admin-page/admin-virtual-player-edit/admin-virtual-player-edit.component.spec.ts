import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminVirtualPlayerEditComponent } from './admin-virtual-player-edit.component';

describe('AdminVirtualPlayerEditComponent', () => {
    let component: AdminVirtualPlayerEditComponent;
    let matDialogRefStub: jasmine.SpyObj<MatDialogRef<AdminVirtualPlayerEditComponent, unknown>>;
    let fixture: ComponentFixture<AdminVirtualPlayerEditComponent>;

    beforeEach(async () => {
        matDialogRefStub = jasmine.createSpyObj(MatDialogRef, ['close']);
        await TestBed.configureTestingModule({
            declarations: [AdminVirtualPlayerEditComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefStub },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { name: 'name' },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminVirtualPlayerEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should edit the name', () => {
        component.formGroup.value.name = 'name';
        component.edit();
        expect(matDialogRefStub.close).toHaveBeenCalledWith('name');
    });
});
