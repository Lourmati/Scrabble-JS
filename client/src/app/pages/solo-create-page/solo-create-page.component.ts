import { Component } from '@angular/core';
import { GameType } from '@app/classes/game/game-type';

@Component({
    selector: 'app-solo-create-page',
    templateUrl: './solo-create-page.component.html',
    styleUrls: ['./solo-create-page.component.scss'],
})
export class SoloCreatePageComponent {
    gameType: GameType = GameType.SOLO;
}
