import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BestScoresClassiqueComponent } from '@app/components/best-scores/best-scores-classique/best-scores-classique.component';
import { BestScoresLOG2990Component } from '@app/components/best-scores/best-scores-log2990/best-scores-log2990.component';

@Component({
    selector: 'app-high-scores-page',
    templateUrl: './high-scores-page.component.html',
    styleUrls: ['./high-scores-page.component.scss'],
})
export class HighScoresPageComponent {
    constructor(public dialog: MatDialog) {}

    openScoresClassique(): void {
        this.dialog.open(BestScoresClassiqueComponent);
    }
    openScoresLOG2990(): void {
        this.dialog.open(BestScoresLOG2990Component);
    }
}
