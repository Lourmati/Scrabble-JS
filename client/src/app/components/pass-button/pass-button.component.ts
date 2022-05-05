import { Component, OnInit } from '@angular/core';
import { PassTurnService } from '@app/services/pass-turn/pass-turn.service';

@Component({
    selector: 'app-pass-button',
    templateUrl: './pass-button.component.html',
    styleUrls: ['./pass-button.component.scss'],
})
export class PassButtonComponent implements OnInit {
    isCurrentPlayer: boolean = false;
    constructor(private readonly passTurnService: PassTurnService) {}

    ngOnInit(): void {
        this.passTurnService.isCurrentPlayer().subscribe((isCurrentPlayer) => (this.isCurrentPlayer = isCurrentPlayer));
    }

    passTurn(): void {
        this.passTurnService.passTurn();
    }
}
