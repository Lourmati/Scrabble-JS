import { Injectable } from '@angular/core';
import { COMPONENT } from '@app/classes/control/component';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class KeyboardHandlerService {
    currentController: BehaviorSubject<COMPONENT>;

    constructor(private readonly gridManager: GridManagerService, private readonly easelService: EaselService) {
        this.currentController = new BehaviorSubject<COMPONENT>(COMPONENT.GAMEPAGE);
    }

    /**
     * Permet d'appeler la méthode correspondante selon le component qui recoit l'évenement
     *
     * @param component component qui recoit l'évenement
     */
    takeControl(component: COMPONENT): void {
        switch (component) {
            case COMPONENT.EASEL:
                this.easelTakeControl();
                this.currentController.next(COMPONENT.EASEL);
                break;
            case COMPONENT.CHATBOX:
                this.chatboxTakeControl();
                this.currentController.next(COMPONENT.CHATBOX);
                break;
            case COMPONENT.GRID:
                this.gridTakeControl();
                this.currentController.next(COMPONENT.GRID);
                break;
        }
    }

    /**
     * Permet au component parent de prendre le controle
     */
    pageTakeControl(): void {
        this.gridManager.handleEscape();
        this.easelService.reset();
    }

    /**
     * Permet au chevalet de prendre le controle si il recoit un evenement
     */
    easelTakeControl(): void {
        this.gridManager.handleEscape();
    }

    /**
     * Permet au grid de prendre le controle si il recoit un evenement
     */
    gridTakeControl(): void {
        this.easelService.reset();
    }

    /**
     * Permet au chatbox de prendre le controle si il recoit un evenement
     */
    chatboxTakeControl(): void {
        this.gridManager.handleEscape();
        this.easelService.reset();
    }

    /**
     * Retourne l'observable sur le composant
     *
     * @returns le component qui a le controle en observable
     */
    getCurrentController(): Observable<COMPONENT> {
        return this.currentController.asObservable();
    }
}
