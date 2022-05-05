import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VIRTUAL_PLAYER_NAME_MAX_LENGTH, VIRTUAL_PLAYER_NAME_MIN_LENGTH } from '@app/constants/admin';

@Component({
    selector: 'app-admin-virtual-player-edit',
    templateUrl: './admin-virtual-player-edit.component.html',
    styleUrls: ['./admin-virtual-player-edit.component.scss'],
})
export class AdminVirtualPlayerEditComponent {
    formGroup: FormGroup;
    constructor(private readonly dialogRef: MatDialogRef<AdminVirtualPlayerEditComponent>, @Inject(MAT_DIALOG_DATA) public data: { name: string }) {
        this.formGroup = new FormGroup({
            name: new FormControl(data.name, [
                Validators.required,
                Validators.minLength(VIRTUAL_PLAYER_NAME_MIN_LENGTH),
                Validators.maxLength(VIRTUAL_PLAYER_NAME_MAX_LENGTH),
            ]),
        });
    }

    edit(): void {
        this.dialogRef.close(this.formGroup.value.name);
    }
}
