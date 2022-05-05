import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketManagerService {
    private socket: Socket;

    /**
     * Indique si le client est connecté au serveur
     *
     * @returns Booléen qui indique si le client est connecté au serveur
     */
    isSocketAlive(): boolean {
        return this.socket && this.socket.connected;
    }

    /**
     * Retourne l'identifiant du client
     *
     * @returns Identifiant du client
     */
    getId(): string {
        return this.socket.id;
    }

    /**
     * Initie une connexion avec le serveur
     */
    connect(): void {
        if (!this.isSocketAlive()) this.socket = io(environment.serverUrl, { transports: ['websocket'], upgrade: false });
    }

    /**
     * Déconnecte le client du serveur
     */
    disconnect(): void {
        this.socket.disconnect();
    }

    /**
     * Écoute un événement et appelle la fonction de rappel
     *
     * @param event Événement à écouter
     * @param action Fonction à appeler lorsque l'événement est reçu
     */
    on<T>(event: string, action: (data: T) => void): void {
        this.socket.on(event, action);
    }

    /**
     * Envoie un événement au serveur
     *
     * @param event Événement à émettre
     * @param data Données à envoyer
     */
    emit(event: string, ...data: unknown[]): void {
        this.socket.emit(event, ...data);
    }
}
