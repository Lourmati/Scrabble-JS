import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import {
    GAME_HISTORY_COLUMNS,
    GAME_HISTORY_DELETE_FAILURE,
    GAME_HISTORY_DELETE_SUCCESS,
    GAME_HISTORY_RESET_FAILURE,
    GAME_HISTORY_RESET_SUCCESS,
    SNACKBAR_DURATION,
} from '@app/constants/admin';
import { AdminService } from '@app/services/admin/admin.service';

@Component({
    selector: 'app-admin-game-history',
    templateUrl: './admin-game-history.component.html',
    styleUrls: ['./admin-game-history.component.scss'],
})
export class AdminGameHistoryComponent implements OnInit {
    gameHistoryColumns: string[] = GAME_HISTORY_COLUMNS;
    gameHistory: GameHistory[];

    constructor(private readonly adminService: AdminService, private readonly matSnackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.update();
    }

    /**
     * Met à jour l'historique des parties
     */
    update(): void {
        this.adminService.getGameHistory().subscribe((gameHistory: GameHistory[]) => {
            gameHistory = gameHistory.map((history) => {
                history.start = new Date(Date.parse(history.start as string)).toLocaleString('fr-FR');
                return history;
            });
            this.gameHistory = gameHistory;
        });
    }

    delete(gameId: string): void {
        this.adminService.deleteGameHistory(gameId).subscribe((status) => {
            const message = status ? GAME_HISTORY_DELETE_SUCCESS : GAME_HISTORY_DELETE_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }

    /**
     * Supprime l'historique des parties
     */
    reset(): void {
        this.adminService.resetGameHistory().subscribe((status) => {
            const message = status ? GAME_HISTORY_RESET_SUCCESS : GAME_HISTORY_RESET_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }
}
