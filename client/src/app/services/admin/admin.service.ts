import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DictionaryInformations } from '@app/classes/admin/dictionary-informations';
import { GameHistory } from '@app/classes/game/game-history/game-history';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { VirtualPlayerNames } from '@app/classes/virtual-player/virtual-player-names';
import { ENDPOINT_DICTIONARY, ENDPOINT_GAME_HISTORY, ENDPOINT_VIRTUAL_PLAYER_NAMES, RESET_ENDPOINT } from '@app/constants/admin';
import { BEST_SCORES_RESET_ENDPOINT } from '@app/constants/best-scores';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    constructor(private readonly http: HttpClient) {}

    /**
     * =========================================================================
     *
     * Dictionnaires
     *
     * =========================================================================
     */

    /**
     * Récupère la liste des dictionnaires disponibles
     *
     * @returns Observable sur la liste des dictionnaires
     */
    getDictionaries(): Observable<DictionaryInformations[]> {
        return this.http.get<DictionaryInformations[]>(environment.serverUrl + ENDPOINT_DICTIONARY);
    }

    /**
     * Ajoute un dictionnaire
     *
     * @param formData Données du formulaire avec le fichier du dictionnaire
     * @returns Observable sur le statut de la requête
     */
    addDictionary(formData: FormData): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.post(environment.serverUrl + ENDPOINT_DICTIONARY, formData, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Modifie un dictionnaire
     *
     * @param dictionary Dictionnaire modifié
     * @returns Observable sur le statut de la requête
     */
    editDictionary(dictionary: DictionaryInformations): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.patch(environment.serverUrl + ENDPOINT_DICTIONARY, dictionary, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable;
    }

    /**
     * Supprime un dictionnaire
     *
     * @param filename Nom du dictionnaire à supprimer
     * @returns Observable sur le statut de la requête
     */
    deleteDictionary(filename: string): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_DICTIONARY + '/' + filename, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Réinitialise la liste des dictionnaires
     *
     * @returns Observable sur le statut de la requête
     */
    resetDictionary(): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_DICTIONARY + RESET_ENDPOINT, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * =========================================================================
     *
     * Noms des joueurs virtuels
     *
     * =========================================================================
     */

    /**
     * Récupérer la liste des noms disponibles
     *
     * @returns Observable sur la liste des noms disponibles
     */
    getVirtualPlayerNames(): Observable<VirtualPlayerNames> {
        return this.http.get<VirtualPlayerNames>(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES);
    }

    /**
     * Ajoute un nom à la liste des noms disponibles
     *
     * @param name Nom à ajouter
     * @param level Niveau du joueur virtuel
     * @returns Observable sur le statut de la requête
     */
    addVirtualPlayerName(name: string, level: VirtualPlayerLevel): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.post(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES, { name, level }, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Modifie un nom dans la liste des noms disponibles
     *
     * @param index Index du nom à modifier
     * @param newName Nouveau nom
     * @param level Niveau du joueur virtuel
     * @returns Observable sur le statut de la requête
     */
    editVirtualPlayerName(index: number, newName: string, level: VirtualPlayerLevel): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.patch(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES, { index, newName, level }, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Supprime un nom dans la liste des noms disponibles
     *
     * @param index Index du nom à supprimer
     * @param level Niveau du joueur virtuel
     * @returns Observable sur le statut de la requête
     */
    deleteVirtualPlayerName(index: number, level: VirtualPlayerLevel): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + '/' + level + '/' + index, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Réinitialise la liste des noms disponibles
     *
     * @returns Observable sur le statut de la requête
     */
    resetVirtualPlayerName(): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_VIRTUAL_PLAYER_NAMES + RESET_ENDPOINT, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * =========================================================================
     *
     * Historique des parties
     *
     * =========================================================================
     */

    /**
     * Récupère l'historique des parties
     *
     * @returns Historique des parties
     */
    getGameHistory(): Observable<GameHistory[]> {
        return this.http.get<GameHistory[]>(environment.serverUrl + ENDPOINT_GAME_HISTORY);
    }

    /**
     * Supprime l'historique des parties
     *
     * @returns Statut de la requête
     */
    deleteGameHistory(gameId: string): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_GAME_HISTORY + '/' + gameId, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * Supprime l'historique des parties
     *
     * @returns Statut de la requête
     */
    resetGameHistory(): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + ENDPOINT_GAME_HISTORY, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }

    /**
     * =========================================================================
     *
     * Meilleurs scores
     *
     * =========================================================================
     */

    resetBestScores(): Observable<boolean> {
        const requestObservable = new Subject<boolean>();
        this.http.delete(environment.serverUrl + BEST_SCORES_RESET_ENDPOINT, { responseType: 'text' }).subscribe(
            () => requestObservable.next(true),
            () => requestObservable.next(false),
        );
        return requestObservable.asObservable();
    }
}
