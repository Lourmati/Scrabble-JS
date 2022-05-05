import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { BEST_SCORE_COLUMNS, BEST_SCORE_RESET_FAILURE, BEST_SCORE_RESET_SUCCESS, SNACKBAR_DURATION } from '@app/constants/admin';
import { BEST_SCORE_CLASSIC, BEST_SCORE_LOG2990 } from '@app/constants/best-scores';
import { BestScoresService } from '@app/services/best-score/best-scores.service';

@Component({
    selector: 'app-admin-best-scores',
    templateUrl: './admin-best-scores.component.html',
    styleUrls: ['./admin-best-scores.component.scss'],
})
export class AdminBestScoresComponent implements OnInit {
    bestScoresColumns: string[] = BEST_SCORE_COLUMNS;
    bestScores: { classic: BestScore[]; log2990: BestScore[] } = { classic: [], log2990: [] };

    constructor(private readonly bestScoresService: BestScoresService, private readonly matSnackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.update();
    }

    /**
     * Met à jour les meilleurs scores
     */
    update(): void {
        this.bestScoresService.getBestScores().subscribe((bestScores: BestScore[]) => {
            if (bestScores.length > 0 && bestScores[0].playerMode === BEST_SCORE_CLASSIC) this.bestScores.classic = bestScores;
            else this.bestScores.log2990 = bestScores;
        });
        this.bestScoresService.getScoreByPlayerMode(BEST_SCORE_CLASSIC);
        this.bestScoresService.getScoreByPlayerMode(BEST_SCORE_LOG2990);
    }

    /**
     * Réinitialise les meilleurs scores
     */
    reset(): void {
        this.bestScoresService.resetScore().subscribe((status: boolean) => {
            const message = status ? BEST_SCORE_RESET_SUCCESS : BEST_SCORE_RESET_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }
}
