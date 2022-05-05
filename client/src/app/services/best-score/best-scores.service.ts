import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { ConnectionState, DISPLAYED_COLUMNS } from '@app/constants/best-scores';
import { AdminService } from '@app/services/admin/admin.service';
import { HttpClientService } from '@app/services/http-client/http-client.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BestScoresService {
    displayedColumns: string[];
    bestScores: Subject<BestScore[]>;
    isScoresAvailable = ConnectionState.NotAvailable;
    isServerAvailable = ConnectionState.Available;

    constructor(private http: HttpClientService, private readonly adminService: AdminService) {
        this.bestScores = new Subject<BestScore[]>();
        this.displayedColumns = DISPLAYED_COLUMNS;
    }

    /**
     * retourne les meilleures scores en observable
     *
     * @return un tableau de meilleures de scores en observables
     */
    getBestScores(): Observable<BestScore[]> {
        return this.bestScores.asObservable();
    }

    /**
     * Gère un nouveau score
     *
     * @param newScore nouveau score
     */
    handleNewBestScore(newScore: BestScore[]): void {
        this.bestScores.next(newScore);
    }

    /**
     * retourne les scores selon le mode de la partie
     *
     * @param gameMode: mode de la game
     */
    async getScoreByPlayerMode(gameMode: string): Promise<void> {
        this.isServerAvailable = ConnectionState.NotAvailable;
        this.http.getBestScores(gameMode).subscribe(
            (bestScores) => {
                this.isScoresAvailable = ConnectionState.Available;
                this.isServerAvailable = ConnectionState.Available;
                this.handleNewBestScore(bestScores);
            },
            () => {
                this.isServerAvailable = ConnectionState.NotAvailable;
            },
        );
    }

    resetScore(): Observable<boolean> {
        return this.adminService.resetBestScores();
    }
}
