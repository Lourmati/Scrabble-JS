import { Injectable } from '@angular/core';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import { HttpClientService } from '@app/services/http-client/http-client.service';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
    providedIn: 'root',
})
export class GameHistoryService {
    gameHistory: Subject<GameHistory[]>;
    constructor(private http: HttpClientService) {
        this.gameHistory = new Subject<GameHistory[]>();
    }

    /**
     * retourne l'historique des parties en observable
     *
     * @return un tableau de meilleures de scores en observables
     */
    getGameHistoryObs(): Observable<GameHistory[]> {
        return this.gameHistory.asObservable();
    }
    /**
     * gére un nouveau historique de partie
     *
     * @param newHistory nouveau score
     */
    handleGameHistory(newHistory: GameHistory[]): void {
        this.gameHistory.next(newHistory);
    }

    /**
     * retourne l'historique des parties
     *
     */
    async getGameHistory(): Promise<void> {
        this.http.getGameHistory().subscribe(this.handleGameHistory.bind(this));
    }
}
