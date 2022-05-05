import { Injectable } from '@angular/core';
import { DictionaryInformations } from '@app/classes/admin/dictionary-informations';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { DICTIONARY_UPDATE, DICTIONARY_UPDATED } from '@app/constants/events';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    gameId: string;
    player: PlayerInformations = { id: '', name: '' };
    isCurrentPlayer: boolean;
    timerDuration: number = 0;
    currentPlayerObservable: BehaviorSubject<boolean>;
    availableDictionaries: BehaviorSubject<DictionaryInformations[]>;

    constructor(public socketManagerService: SocketManagerService) {
        this.isCurrentPlayer = false;
        this.socketManagerService.connect();
        this.currentPlayerObservable = new BehaviorSubject<boolean>(this.isCurrentPlayer);
        this.availableDictionaries = new BehaviorSubject<DictionaryInformations[]>([]);
        this.socketManagerService.on(DICTIONARY_UPDATED, this.handleAvailableDictionariesUpdate.bind(this));
    }

    /**
     * Définit si ce client est le joueur courant
     *
     * @param currentPlayerId Identifiant du joueur courant
     */
    setCurrentPlayer(currentPlayerId: string): void {
        this.isCurrentPlayer = this.player && this.player.id === currentPlayerId;
        this.currentPlayerObservable.next(this.isCurrentPlayer);
    }

    /**
     * Retourne un observable qui permet de savoir si c'est à ce joueur de jouer
     *
     * @returns Observable sur le joueur courant
     */
    getCurrentPlayerObservable(): Observable<boolean> {
        return this.currentPlayerObservable.asObservable();
    }

    /**
     * Retourne l'identifiant de la partie
     *
     * @returns Identifiant de la partie
     */
    getId(): string {
        return this.gameId;
    }

    /**
     * Définit l'identifiant de la partie
     *
     * @param gameId Identifiant de la partie
     */
    setId(gameId: string): void {
        this.gameId = gameId;
    }

    /**
     * Retourne le nom du joueur
     *
     * @returns Nom du joueur
     */
    getPlayerName(): string {
        return this.player.name;
    }

    /**
     * Définit les informations du joueur
     *
     * @param name Nom du joueur
     */
    setPlayer(name: string): void {
        this.player = { id: this.socketManagerService.getId(), name };
    }

    /**
     * Défini la durée du timer
     *
     * @param duration Durée du timer
     */
    setTimerDuration(duration: number): void {
        this.timerDuration = duration;
    }

    /**
     * Retourne la durée du timer
     *
     * @returns Durée du timer
     */
    getTimerDuration(): number {
        return this.timerDuration;
    }

    /**
     * Met à jour la liste des dictionnaires
     */
    updateAvailableDictionaries(): void {
        this.socketManagerService.emit(DICTIONARY_UPDATE);
    }

    /**
     * Met à jour la liste des dictionnaires disponibles dans les composants
     *
     * @param dictionaries Liste des dictionnaires disponibles
     */
    handleAvailableDictionariesUpdate(dictionaries: DictionaryInformations[]): void {
        this.availableDictionaries.next(dictionaries);
    }

    /**
     * Retourne un observable sur la liste des dictionnaires disponibles
     *
     * @returns Observable sur la liste des dictionnaires disponibles
     */
    getAvailableDictionaries(): Observable<DictionaryInformations[]> {
        return this.availableDictionaries.asObservable();
    }
}
