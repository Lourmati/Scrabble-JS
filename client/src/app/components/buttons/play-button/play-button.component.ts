import { Component, OnInit } from '@angular/core';
import { GameService } from '@app/services/game/game.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';

@Component({
    selector: 'app-play-button',
    templateUrl: './play-button.component.html',
    styleUrls: ['./play-button.component.scss'],
})
export class PlayButtonComponent implements OnInit {
    isCurrentPlayer: boolean;

    constructor(private readonly gridManager: GridManagerService, private readonly gameService: GameService) {}

    ngOnInit(): void {
        this.gameService.getCurrentPlayerObservable().subscribe(this.handleTurn.bind(this));
    }

    handleTurn(onCurrentPlayer: boolean) {
        this.isCurrentPlayer = onCurrentPlayer;
    }

    play() {
        this.gridManager.handleEnter();
    }
}
