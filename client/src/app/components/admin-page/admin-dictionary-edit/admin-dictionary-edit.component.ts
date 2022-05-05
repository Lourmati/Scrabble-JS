import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DictionaryInformations } from '@app/classes/admin/dictionary-informations';
import {
    DICTIONARY_DESCRIPTION_MAX_LENGTH,
    DICTIONARY_DESCRIPTION_MIN_LENGTH,
    DICTIONARY_TITLE_MAX_LENGTH,
    DICTIONARY_TITLE_MIN_LENGTH,
} from '@app/constants/admin';

@Component({
    selector: 'app-admin-dictionary-edit',
    templateUrl: './admin-dictionary-edit.component.html',
    styleUrls: ['./admin-dictionary-edit.component.scss'],
})
export class AdminDictionaryEditComponent {
    formGroup: FormGroup;
    constructor(
        private readonly dialogRef: MatDialogRef<AdminDictionaryEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { dictionary: DictionaryInformations },
    ) {
        this.formGroup = new FormGroup({
            title: new FormControl(data.dictionary.title, [
                Validators.required,
                Validators.minLength(DICTIONARY_TITLE_MIN_LENGTH),
                Validators.maxLength(DICTIONARY_TITLE_MAX_LENGTH),
            ]),
            description: new FormControl(data.dictionary.description, [
                Validators.required,
                Validators.minLength(DICTIONARY_DESCRIPTION_MIN_LENGTH),
                Validators.maxLength(DICTIONARY_DESCRIPTION_MAX_LENGTH),
            ]),
        });
    }

    edit(): void {
        this.dialogRef.close({
            title: this.formGroup.value.title,
            description: this.formGroup.value.description,
            filename: this.data.dictionary.filename,
        });
    }
}
