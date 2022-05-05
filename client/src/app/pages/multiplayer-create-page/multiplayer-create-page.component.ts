import { Component } from '@angular/core';
import { GameType } from '@app/classes/game/game-type';

@Component({
    selector: 'app-multiplayer-create-page',
    templateUrl: './multiplayer-create-page.component.html',
    styleUrls: ['./multiplayer-create-page.component.scss'],
})
export class MultiplayerCreatePageComponent {
    gameType: GameType = GameType.MULTIPLAYER;
}
