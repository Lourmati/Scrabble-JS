import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryInformations } from '@app/classes/admin/dictionary-informations';
import { AdminDictionaryDeleteComponent } from '@app/components/admin-page/admin-dictionary-delete/admin-dictionary-delete.component';
import { AdminDictionaryEditComponent } from '@app/components/admin-page/admin-dictionary-edit/admin-dictionary-edit.component';
import { AdminDictionaryResetComponent } from '@app/components/admin-page/admin-dictionary-reset/admin-dictionary-reset.component';
import {
    DICTIONARY_ADD_FAILURE,
    DICTIONARY_ADD_SUCCESS,
    DICTIONARY_COLUMNS,
    DICTIONARY_CREATE_UPLOAD_FAILURE,
    DICTIONARY_DEFAULT,
    DICTIONARY_DELETE_FAILURE,
    DICTIONARY_DELETE_SUCCESS,
    DICTIONARY_EDIT_FAILURE,
    DICTIONARY_EDIT_SUCCESS,
    DICTIONARY_FILE_MAX_SIZE,
    DICTIONARY_FILE_TYPE,
    DICTIONARY_RESET_FAILURE,
    DICTIONARY_RESET_SUCCESS,
    SNACKBAR_DURATION,
} from '@app/constants/admin';
import { AdminService } from '@app/services/admin/admin.service';

@Component({
    selector: 'app-admin-dictionary',
    templateUrl: './admin-dictionary.component.html',
    styleUrls: ['./admin-dictionary.component.scss'],
})
export class AdminDictionaryComponent implements OnInit {
    addDictionaryForm: FormGroup;
    formData: FormData;
    dictionariesColumns: string[] = DICTIONARY_COLUMNS;
    dictionaries: DictionaryInformations[];
    dictionaryDefault: string = DICTIONARY_DEFAULT;

    selectedFile: string;

    constructor(private readonly adminService: AdminService, private readonly matDialog: MatDialog, private readonly matSnackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.formData = new FormData();
        this.addDictionaryForm = new FormGroup({
            dictionary: new FormControl('', [Validators.required]),
        });
        this.update();
    }

    update(): void {
        this.adminService.getDictionaries().subscribe((dictionaries: DictionaryInformations[]) => (this.dictionaries = dictionaries));
    }

    edit(dictionary: DictionaryInformations): void {
        const reference = this.matDialog.open(AdminDictionaryEditComponent, {
            data: { dictionary: { ...dictionary } },
        });
        reference.afterClosed().subscribe((updatedDictionary: DictionaryInformations) => {
            if (updatedDictionary) this.editOnService(updatedDictionary);
        });
    }

    editOnService(editedDictionary: DictionaryInformations): void {
        this.adminService.editDictionary(editedDictionary).subscribe((status: boolean) => {
            const message = status ? DICTIONARY_EDIT_SUCCESS : DICTIONARY_EDIT_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }

    delete(filename: string): void {
        const dialogReference = this.matDialog.open(AdminDictionaryDeleteComponent);
        dialogReference.afterClosed().subscribe((status: boolean) => {
            if (status) this.deleteOnService(filename);
        });
    }

    deleteOnService(filename: string): void {
        this.adminService.deleteDictionary(filename).subscribe((status: boolean) => {
            const message = status ? DICTIONARY_DELETE_SUCCESS : DICTIONARY_DELETE_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }

    onFileSelected(event: Event): void {
        if (event) {
            const target: HTMLInputElement = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const file: File = target.files[0];
                if (file.size <= DICTIONARY_FILE_MAX_SIZE && file.type === DICTIONARY_FILE_TYPE) {
                    this.formData.append('dictionary', file, file.name);
                    this.selectedFile = file.name;
                } else this.matSnackBar.open(DICTIONARY_CREATE_UPLOAD_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
            }
        }
    }

    add(): void {
        if (!this.addDictionaryForm.valid) return;
        this.adminService.addDictionary(this.formData).subscribe((status: boolean) => {
            const message = status ? DICTIONARY_ADD_SUCCESS : DICTIONARY_ADD_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });

            if (status) {
                this.update();
                this.formData = new FormData();
                this.addDictionaryForm.reset();
            }
        });
    }

    reset(): void {
        const dialogReference = this.matDialog.open(AdminDictionaryResetComponent);
        dialogReference.afterClosed().subscribe((status: boolean) => {
            if (status) this.resetOnService();
        });
    }

    resetOnService(): void {
        this.adminService.resetDictionary().subscribe((status: boolean) => {
            const message = status ? DICTIONARY_RESET_SUCCESS : DICTIONARY_RESET_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }
}
