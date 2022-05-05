import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminDictionaryComponent } from '@app/components/admin-page/admin-dictionary/admin-dictionary.component';
import {
    DICTIONARY_ADD_FAILURE,
    DICTIONARY_ADD_SUCCESS,
    DICTIONARY_CREATE_UPLOAD_FAILURE,
    DICTIONARY_DELETE_FAILURE,
    DICTIONARY_DELETE_SUCCESS,
    DICTIONARY_EDIT_FAILURE,
    DICTIONARY_EDIT_SUCCESS,
    DICTIONARY_FILE_MAX_SIZE,
    DICTIONARY_RESET_FAILURE,
    DICTIONARY_RESET_SUCCESS,
    SNACKBAR_DURATION,
} from '@app/constants/admin';
import { AdminService } from '@app/services/admin/admin.service';
import { from } from 'rxjs';

const MOCK_DICTIONARY = {
    title: 'test',
    description: 'test',
    filename: 'test.json',
};

describe('AdminDictionaryComponent', () => {
    let component: AdminDictionaryComponent;
    let adminServiceStub: jasmine.SpyObj<AdminService>;
    let matDialogStub: jasmine.SpyObj<MatDialog>;
    let matSnackBarStub: jasmine.SpyObj<MatSnackBar>;
    let matDialogRefStub: jasmine.SpyObj<MatDialogRef<AdminDictionaryComponent, unknown>>;

    let fixture: ComponentFixture<AdminDictionaryComponent>;

    beforeEach(async () => {
        adminServiceStub = jasmine.createSpyObj(AdminService, [
            'getDictionaries',
            'addDictionary',
            'editDictionary',
            'deleteDictionary',
            'resetDictionary',
        ]);
        matDialogStub = jasmine.createSpyObj(MatDialog, ['open']);
        matSnackBarStub = jasmine.createSpyObj(MatSnackBar, ['open']);
        matDialogRefStub = jasmine.createSpyObj(MatDialogRef, ['afterClosed']);

        matDialogStub.open.and.returnValue(matDialogRefStub);
        adminServiceStub.getDictionaries.and.returnValue(from([[MOCK_DICTIONARY]]));

        await TestBed.configureTestingModule({
            declarations: [AdminDictionaryComponent],
            providers: [
                { provide: AdminService, useValue: adminServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: MatSnackBar, useValue: matSnackBarStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDictionaryComponent);
        component = fixture.componentInstance;
        component.dictionaries = [MOCK_DICTIONARY];
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should edit a dictionary', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([MOCK_DICTIONARY]));
        const spy = spyOn(component, 'editOnService');
        component.edit(MOCK_DICTIONARY);
        expect(matDialogStub.open).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(MOCK_DICTIONARY);
    });

    it('Should edit a dictionary', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([null]));
        const spy = spyOn(component, 'editOnService');
        component.edit(MOCK_DICTIONARY);
        expect(matDialogStub.open).toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should edit on service', () => {
        adminServiceStub.editDictionary.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.editOnService(MOCK_DICTIONARY);
        expect(adminServiceStub.editDictionary).toHaveBeenCalledWith(MOCK_DICTIONARY);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_EDIT_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should edit on service', () => {
        adminServiceStub.editDictionary.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.editOnService(MOCK_DICTIONARY);
        expect(adminServiceStub.editDictionary).toHaveBeenCalledWith(MOCK_DICTIONARY);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_EDIT_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should delete a dictionary', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([true]));
        const spy = spyOn(component, 'deleteOnService');
        component.delete(MOCK_DICTIONARY.filename);
        expect(spy).toHaveBeenCalledWith(MOCK_DICTIONARY.filename);
    });

    it('Should delete a dictionary', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([false]));
        const spy = spyOn(component, 'deleteOnService');
        component.delete(MOCK_DICTIONARY.filename);
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should delete on service', () => {
        adminServiceStub.deleteDictionary.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.deleteOnService(MOCK_DICTIONARY.filename);
        expect(adminServiceStub.deleteDictionary).toHaveBeenCalledWith(MOCK_DICTIONARY.filename);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_DELETE_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should delete on service', () => {
        adminServiceStub.deleteDictionary.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.deleteOnService(MOCK_DICTIONARY.filename);
        expect(adminServiceStub.deleteDictionary).toHaveBeenCalledWith(MOCK_DICTIONARY.filename);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_DELETE_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should handle file upload', () => {
        const spy = spyOn(component.formData, 'append');
        component.onFileSelected(undefined as unknown as Event);
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should handle file upload', () => {
        const file = jasmine.createSpyObj(File, {
            name: 'dictionary.json',
        });
        file.name = 'dictionary.json';
        file.size = DICTIONARY_FILE_MAX_SIZE - 1;
        file.type = 'application/json';

        const fileList = jasmine.createSpyObj(FileList, ['item']);
        fileList[0] = file;
        fileList.item.and.returnValue(file);
        fileList.length = 1;

        const inputStub = jasmine.createSpyObj(HTMLInputElement, ['click']);
        inputStub.files = fileList;

        const eventStub = jasmine.createSpyObj(Event, ['preventDefault']);
        eventStub.target = inputStub;

        const spy = spyOn(component.formData, 'append');
        component.onFileSelected(eventStub);
        expect(spy).toHaveBeenCalled();
    });

    it('Should handle file upload', () => {
        const file = jasmine.createSpyObj(File, {
            name: 'dictionary.json',
        });
        file.name = 'dictionary.json';
        file.size = DICTIONARY_FILE_MAX_SIZE + 1;
        file.type = 'application/json';

        const fileList = jasmine.createSpyObj(FileList, ['item']);
        fileList[0] = file;
        fileList.item.and.returnValue(file);
        fileList.length = 1;

        const inputStub = jasmine.createSpyObj(HTMLInputElement, ['click']);
        inputStub.files = fileList;

        const eventStub = jasmine.createSpyObj(Event, ['preventDefault']);
        eventStub.target = inputStub;

        component.onFileSelected(eventStub);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_CREATE_UPLOAD_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
    });

    it('Should handle file upload', () => {
        const file = jasmine.createSpyObj(File, {
            name: 'dictionary.json',
        });
        file.name = 'dictionary.json';
        file.size = DICTIONARY_FILE_MAX_SIZE - 1;
        file.type = 'image/jpeg';

        const fileList = jasmine.createSpyObj(FileList, ['item']);
        fileList[0] = file;
        fileList.item.and.returnValue(file);
        fileList.length = 1;

        const inputStub = jasmine.createSpyObj(HTMLInputElement, ['click']);
        inputStub.files = fileList;

        const eventStub = jasmine.createSpyObj(Event, ['preventDefault']);
        eventStub.target = inputStub;

        component.onFileSelected(eventStub);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_CREATE_UPLOAD_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
    });

    it('Should handle file upload', () => {
        const file = jasmine.createSpyObj(File, {
            name: 'dictionary.json',
        });
        file.name = 'dictionary.json';
        file.size = DICTIONARY_FILE_MAX_SIZE - 1;
        file.type = 'image/jpeg';

        const fileList = jasmine.createSpyObj(FileList, ['item']);
        fileList[0] = file;
        fileList.item.and.returnValue(file);
        fileList.length = 0;

        const inputStub = jasmine.createSpyObj(HTMLInputElement, ['click']);
        inputStub.files = fileList;

        const eventStub = jasmine.createSpyObj(Event, ['preventDefault']);
        eventStub.target = inputStub;

        const spy = spyOn(component.formData, 'append');
        component.onFileSelected(eventStub);
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should add a dictionary', () => {
        component.addDictionaryForm.value.dictionary = undefined;
        component.add();
        expect(adminServiceStub.addDictionary).not.toHaveBeenCalled();
    });

    it('Should add a dictionary', () => {
        component.addDictionaryForm.setValue({ dictionary: 'dictionary' });
        adminServiceStub.addDictionary.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.add();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_ADD_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should add a dictionary', () => {
        component.addDictionaryForm.setValue({ dictionary: 'dictionary' });
        adminServiceStub.addDictionary.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.add();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_ADD_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should reset dictionaries', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([true]));
        const spy = spyOn(component, 'resetOnService');
        component.reset();
        expect(spy).toHaveBeenCalled();
    });

    it('Should reset dictionaries', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([false]));
        const spy = spyOn(component, 'resetOnService');
        component.reset();
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should reset on service', () => {
        adminServiceStub.resetDictionary.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.resetOnService();
        expect(adminServiceStub.resetDictionary).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_RESET_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should delete on service', () => {
        adminServiceStub.resetDictionary.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.resetOnService();
        expect(adminServiceStub.resetDictionary).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(DICTIONARY_RESET_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).not.toHaveBeenCalled();
    });
});
