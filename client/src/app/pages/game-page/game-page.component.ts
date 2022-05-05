import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { COMPONENT } from '@app/classes/control/component';
import { GameMode } from '@app/classes/game/game-mode';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
    mode: GameMode;
    constructor(private readonly keyboardHandler: KeyboardHandlerService, private readonly route: ActivatedRoute) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.mode = params.mode;
        });
    }

    handleComponentClick(event: MouseEvent) {
        this.keyboardHandler.takeControl(COMPONENT.GAMEPAGE);
        event.stopPropagation();
    }
}
