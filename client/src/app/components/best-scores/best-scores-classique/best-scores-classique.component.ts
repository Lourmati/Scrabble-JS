import { Component, OnInit } from '@angular/core';
import { BestScore } from '@app/classes/best-scores/best-scores';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import { BestScoresService } from '@app/services/best-score/best-scores.service';
import { ConnectionState } from '@app/constants/best-scores';

@Component({
    selector: 'app-best-scores-classique',
    templateUrl: './best-scores-classique.component.html',
    styleUrls: ['./best-scores-classique.component.scss'],
})
export class BestScoresClassiqueComponent implements OnInit {
    displayedColumns: string[];
    dataSource: BestScore[];
    testGameHistory: GameHistory[];
    isScoresAvailable: ConnectionState;
    constructor(private readonly service: BestScoresService) {
        this.displayedColumns = service.displayedColumns;
    }

    ngOnInit(): void {
        this.service.getBestScores().subscribe((bestScores: BestScore[]) => (this.dataSource = bestScores));
        this.service.getScoreByPlayerMode('Classique');
        this.isScoresAvailable = this.service.isScoresAvailable;
    }

    getScoresAvailability(): ConnectionState {
        return this.service.isScoresAvailable;
    }

    getServerAvailability(): ConnectionState {
        return this.service.isServerAvailable;
    }
}
