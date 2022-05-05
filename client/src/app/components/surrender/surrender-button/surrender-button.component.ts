import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SurrenderDialogComponent } from '@app/components/surrender/surrender-dialog/surrender-dialog.component';

@Component({
    selector: 'app-surrender-button',
    templateUrl: './surrender-button.component.html',
    styleUrls: ['./surrender-button.component.scss'],
})
export class SurrenderButtonComponent {
    constructor(public dialog: MatDialog) {}

    surrender(): void {
        this.dialog.open(SurrenderDialogComponent);
    }
}
