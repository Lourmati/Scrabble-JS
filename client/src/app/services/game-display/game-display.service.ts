import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { Grid } from '@app/classes/grid/grid';
import { Objective } from '@app/classes/objective/objective';
import { EASEL_UPDATED, GRID_UPDATED } from '@app/constants/events';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameDisplayService {
    gridUpdate: BehaviorSubject<Grid>;
    easelUpdate: BehaviorSubject<Letter[]>;
    publicObjectives: BehaviorSubject<Objective[]>;
    privateObjective: BehaviorSubject<Objective>;

    constructor(public socketService: SocketManagerService) {
        this.gridUpdate = new BehaviorSubject<Grid>(Grid.getGrid());
        this.easelUpdate = new BehaviorSubject<Letter[]>([]);
        this.registerEvents();
    }

    /**
     * Retourne un observable sur la grille
     *
     * @returns Observable sur la grille
     */
    onUpdateGrid(): Observable<Grid> {
        return this.gridUpdate.asObservable();
    }

    /**
     * Retourne un observable sur le chevalet
     *
     * @returns Observable sur le chevalet
     */
    onUpdateEasel(): Observable<Letter[]> {
        return this.easelUpdate.asObservable();
    }
    /**
     * Enregistre les évènements de Socket
     */
    private registerEvents() {
        this.socketService.on(GRID_UPDATED, this.updateGrid.bind(this));
        this.socketService.on(EASEL_UPDATED, this.updateEasel.bind(this));
    }

    /**
     * Met à jour la grille
     *
     * @param grid Grille
     */
    private updateGrid(grid: Grid): void {
        this.gridUpdate.next(grid);
    }

    /**
     * Met à jour le chevalet
     *
     * @param letters Lettres du chevalet
     */
    private updateEasel(letters: Letter[]): void {
        this.easelUpdate.next(letters);
    }
}
