import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminDictionaryEditComponent } from './admin-dictionary-edit.component';

const MOCK_DICTIONARY = {
    title: 'test',
    description: 'test',
    filename: 'test.json',
};

describe('AdminDictionaryEditComponent', () => {
    let component: AdminDictionaryEditComponent;
    let matDialogRefStub: jasmine.SpyObj<MatDialogRef<AdminDictionaryEditComponent, unknown>>;
    let fixture: ComponentFixture<AdminDictionaryEditComponent>;

    beforeEach(async () => {
        matDialogRefStub = jasmine.createSpyObj(MatDialogRef, ['close']);
        await TestBed.configureTestingModule({
            declarations: [AdminDictionaryEditComponent],
            providers: [
                { provide: MatDialogRef, useValue: matDialogRefStub },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: { dictionary: MOCK_DICTIONARY },
                },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDictionaryEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should edit the dictionary', () => {
        component.formGroup.value.title = 'title';
        component.formGroup.value.description = 'description';
        component.edit();
        expect(matDialogRefStub.close).toHaveBeenCalledWith({
            title: 'title',
            description: 'description',
            filename: MOCK_DICTIONARY.filename,
        });
    });
});
