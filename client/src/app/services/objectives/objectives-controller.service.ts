import { Injectable } from '@angular/core';
import { Objective } from '@app/classes/objective/objective';
import { EVENT_UPDATE_OBJECTIVES, PRIVATE_OBJECTIVE_UPDATE } from '@app/constants/events';
import { DEFAULT_PRIVATE_OBJECTIVE } from '@app/constants/objectives';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesControllerService {
    publicObjectives: BehaviorSubject<Objective[]>;
    privateObjective: BehaviorSubject<Objective>;
    constructor(private socketManagerService: SocketManagerService) {
        this.publicObjectives = new BehaviorSubject<Objective[]>([]);
        this.privateObjective = new BehaviorSubject<Objective>(DEFAULT_PRIVATE_OBJECTIVE);
        this.handleEvents();
    }
    /**
     * Gère les évènements
     */
    handleEvents(): void {
        this.socketManagerService.on(EVENT_UPDATE_OBJECTIVES, this.handlePublicObjectivesUpdate.bind(this));
        this.socketManagerService.on(PRIVATE_OBJECTIVE_UPDATE, this.handlePrivateObjectiveUpdate.bind(this));
    }

    /**
     * @returns les objectifs publics
     */
    getPublicObjectives(): Observable<Objective[]> {
        return this.publicObjectives.asObservable();
    }

    /**
     * @returns l'objectif privé
     */
    getPrivateObjectives(): Observable<Objective> {
        return this.privateObjective.asObservable();
    }

    /**
     * Gère la mise à jour des objectifs publics
     *
     * @param publicObjectives Objectifs publics
     */
    handlePublicObjectivesUpdate(publicObjectives: Objective[]): void {
        this.publicObjectives.next(publicObjectives);
    }

    /**
     * Gère la mise à jour de l'objectif privé
     *
     * @param privateObjective Objectif privé
     */
    handlePrivateObjectiveUpdate(privateObjective: Objective): void {
        this.privateObjective.next(privateObjective);
    }
}
