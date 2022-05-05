import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import { BEST_SCORES_URL } from '@app/constants/best-scores';
import { GAME_HISTORY_URL } from '@app/constants/game-history';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HttpClientService {
    constructor(private readonly http: HttpClient) {}

    /**
     * Récupère les meilleurs scores
     *
     * @param gameMode Mode de jeu
     * @returns Observable sur les scores
     */

    getBestScores(gameMode: string): Observable<BestScore[]> {
        return this.http.get<BestScore[]>(BEST_SCORES_URL + gameMode).pipe(catchError(this.handleError));
    }

    /**
     * Récupère l'historique des parties
     *
     * @returns Observable sur les historiques
     */
    getGameHistory(): Observable<GameHistory[]> {
        return this.http.get<GameHistory[]>(GAME_HISTORY_URL);
    }

    /**
     * @returns Observable sur les erreurs
     */
    private handleError(error: HttpErrorResponse): Observable<BestScore[]> {
        return throwError(error.message);
    }
}
