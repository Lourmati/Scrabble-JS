import { Component, OnInit } from '@angular/core';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GameService } from '@app/services/game/game.service';

@Component({
    selector: 'app-exchange-button',
    templateUrl: './exchange-button.component.html',
    styleUrls: ['./exchange-button.component.scss'],
})
export class ExchangeButtonComponent implements OnInit {
    isCurrentPlayer: boolean;
    onExchange: boolean = false;

    constructor(private readonly easelService: EaselService, private readonly gameService: GameService) {}

    ngOnInit(): void {
        this.easelService.getExchange().subscribe(this.handleExchange.bind(this));
        this.gameService.getCurrentPlayerObservable().subscribe(this.handleTurn.bind(this));
    }

    exchange() {
        this.easelService.exchangeLetters();
    }
    handleExchange(onExchange: boolean) {
        this.onExchange = onExchange;
    }
    handleTurn(onCurrentPlayer: boolean) {
        this.isCurrentPlayer = onCurrentPlayer;
    }
}
