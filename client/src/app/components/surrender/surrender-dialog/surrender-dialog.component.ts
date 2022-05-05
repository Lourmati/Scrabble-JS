import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game/game.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';

@Component({
    selector: 'app-surrender-dialog',
    templateUrl: './surrender-dialog.component.html',
    styleUrls: ['./surrender-dialog.component.scss'],
})
export class SurrenderDialogComponent {
    constructor(
        private readonly socketManagerService: SocketManagerService,
        private readonly gameService: GameService,
        private readonly router: Router,
    ) {}

    surrender() {
        this.socketManagerService.emit('game:surrender', this.gameService.getId());
        this.router.navigate(['/']);
    }
}
