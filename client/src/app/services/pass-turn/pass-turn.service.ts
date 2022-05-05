import { Injectable } from '@angular/core';
import { COMMAND_TAKE_TURN } from '@app/constants/command';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PassTurnService {
    constructor(private readonly chatboxService: ChatboxService, private readonly gameService: GameService) {}

    /**
     * Retourne un observable qui indique si on est le joueur courant
     *
     * @returns Observable sur le joueur courant
     */
    isCurrentPlayer(): Observable<boolean> {
        return this.gameService.getCurrentPlayerObservable();
    }

    /**
     * Passe le tour du joueur
     */
    passTurn(): void {
        this.chatboxService.emitMessage(COMMAND_TAKE_TURN);
    }
}
