import { Injectable } from '@angular/core';
import { SidebarInformations } from '@app/classes/sidebar/sidebar-informations';
import { SIDEBAR_UPDATED } from '@app/constants/events';
import { DEFAULT_SIDEBAR_INFORMATIONS } from '@app/constants/sidebar';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    private sidebarInformations: BehaviorSubject<SidebarInformations>;

    constructor(private readonly socketManagerService: SocketManagerService) {
        this.socketManagerService.connect();
        this.sidebarInformations = new BehaviorSubject<SidebarInformations>(DEFAULT_SIDEBAR_INFORMATIONS);
        this.registerEvent();
    }

    /**
     * Retourne un observable sur les informations la barre latérale
     *
     * @returns Observable des informations la barre latérale
     */
    getSidebarInformations(): Observable<SidebarInformations> {
        return this.sidebarInformations.asObservable();
    }

    /**
     * Met à jour les informations de la barre latérale
     *
     * @param sidebarInformations Informations de la barre latérale
     */
    private handleUpdate(sidebarInformations: SidebarInformations): void {
        this.sidebarInformations.next(sidebarInformations);
    }

    /**
     * Enregistre l'événement de mise à jour de la barre latérale
     */
    private registerEvent(): void {
        this.socketManagerService.on(SIDEBAR_UPDATED, this.handleUpdate.bind(this));
    }
}
