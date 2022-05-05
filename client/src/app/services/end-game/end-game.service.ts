import { Injectable } from '@angular/core';
import { PlayerScore } from '@app/classes/player/player-score';
import { GAME_ENDED } from '@app/constants/events';
import { DRAW_MESSAGE, LOSE_MESSAGE, WIN_MESSAGE } from '@app/constants/game';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EndGameService {
    private content: Subject<string>;

    constructor(private readonly socketMangerService: SocketManagerService) {
        this.content = new Subject<string>();
        this.socketMangerService.connect();
        this.registerEvent();
    }

    /**
     * Retourne un observable sur le gagnant
     *
     * @returns Observable sur le gagnant
     */
    getContent(): Observable<string> {
        return this.content.asObservable();
    }

    /**
     * Enregistre les évènements
     */
    private registerEvent(): void {
        this.socketMangerService.on(GAME_ENDED, this.handleEndGame.bind(this));
    }

    /**
     * Gère la fin de partie
     *
     * @param scores Informations sur les scores finaux
     */
    private handleEndGame(scores: PlayerScore[]): void {
        this.content.next(this.computeContent(scores));
    }

    /**
     * Retourne le statut de la partie
     *
     * @param scores Informations sur les scores finaux
     * @returns Statut de la partie
     */
    private computeContent(scores: PlayerScore[]): string {
        const myIndex = scores[0].player.id === this.socketMangerService.getId() ? 0 : 1;
        const otherIndex = myIndex === 0 ? 1 : 0;
        if (scores[myIndex].score > scores[otherIndex].score) return WIN_MESSAGE;
        else if (scores[myIndex].score === scores[otherIndex].score) return DRAW_MESSAGE;
        else return LOSE_MESSAGE;
    }
}
