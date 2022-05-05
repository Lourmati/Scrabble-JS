import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EndGameStatus } from '@app/classes/game/end-game-status';
import { EndGameDialogComponent } from '@app/components/end-game-dialog/end-game-dialog.component';
import { EndGameService } from '@app/services/end-game/end-game.service';

@Component({
    selector: 'app-end-game',
    templateUrl: './end-game.component.html',
    styleUrls: ['./end-game.component.scss'],
})
export class EndGameComponent {
    status: EndGameStatus;

    constructor(private readonly endGameService: EndGameService, private readonly dialog: MatDialog) {
        this.endGameService.getContent().subscribe(this.handleStatusUpdate.bind(this));
    }

    private handleStatusUpdate(content: string): void {
        this.dialog.open(EndGameDialogComponent, { data: { content } });
    }
}
