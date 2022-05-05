import { Letter } from '@app/classes/common/letter';
import { Duration } from '@app/classes/game-history/duration';
import { GameParameters } from '@app/classes/game/game-parameters';
import { GameType } from '@app/classes/game/game-type';
import { GridServer } from '@app/classes/grid/grid';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { Player } from '@app/classes/player/player';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { Reserve } from '@app/classes/reserve/reserve';
import { SidebarInformations } from '@app/classes/sidebar/sidebar-informations';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { RANDOM_BOOLEAN } from '@app/constants/common';
import { EASEL_MAX_SIZE } from '@app/constants/easel';
import { END_GAME_TURN_THRESHOLD, MILLISECONDS_TO_SECONDS_FACTOR, SECONDS_TO_MINUTES_FACTOR } from '@app/constants/game';

export class Game {
    id: string;
    parameters: GameParameters;
    grid: GridServer;
    reserve: Reserve;
    currentPlayer: Player;
    otherPlayer: Player;
    type: GameType;
    isGridEmpty: boolean;
    placeRightPlayer: boolean = true;
    objectives: Objective[] = [];
    isPrivateSet: boolean = false;
    allPlacedWords: string[] = [];
    start: Date;
    startTurn: Date;

    constructor(hostInformations: PlayerInformations, parameters: GameParameters, type: GameType) {
        this.id = hostInformations.id;
        this.start = new Date();
        this.parameters = parameters;
        this.reserve = new Reserve();
        this.grid = new GridServer();
        this.isGridEmpty = true;
        this.type = type;
        this.startTurn = new Date();
    }

    /**
     * Termine la partie
     *
     * @returns Durée de la partie
     */
    end(): Duration {
        const delta = Math.ceil((new Date().getTime() - this.start.getTime()) / MILLISECONDS_TO_SECONDS_FACTOR);
        const seconds = delta % SECONDS_TO_MINUTES_FACTOR;
        const minutes = (delta - seconds) / SECONDS_TO_MINUTES_FACTOR;
        return { seconds, minutes };
    }

    /**
     * Créé et assigne les joueurs de la partie
     *
     * @param host Informations du joueur hôte
     * @param guest Informations du joueur invité
     */
    setPlayersMultiplayer(host: PlayerInformations, guest: PlayerInformations): void {
        const random = RANDOM_BOOLEAN();
        const player1 = new Player(host.name, host.id, this.reserve.removeRandomLetters(EASEL_MAX_SIZE));
        const player2 = new Player(guest.name, guest.id, this.reserve.removeRandomLetters(EASEL_MAX_SIZE));
        this.currentPlayer = random ? player1 : player2;
        this.otherPlayer = random ? player2 : player1;
    }

    setPlayersSolo(hostInformations: PlayerInformations, virtualPlayerName: string, level: VirtualPlayerLevel): void {
        this.currentPlayer = new Player(hostInformations.name, hostInformations.id, this.reserve.removeRandomLetters(EASEL_MAX_SIZE));
        this.otherPlayer = new VirtualPlayer(virtualPlayerName, this.reserve.removeRandomLetters(EASEL_MAX_SIZE), level);
    }

    setObjectives(objectives: Objective[], playersId: string[]): void {
        this.objectives = objectives;
        this.setPrivateObjectivesId(playersId);
    }

    setPrivateObjectivesId(playersId: string[]): void {
        for (const objective of this.objectives) {
            if (objective.type === ObjectiveType.PRIVATE) {
                if (this.isPrivateSet === false) {
                    objective.id = playersId[0];
                    this.isPrivateSet = true;
                } else objective.id = playersId[1];
            }
        }
    }

    /**
     * Indique si c'est à ce joueur de jouer
     *
     * @param playerId Identifiant du joueur
     * @returns Booléen qui indique si c'est à ce joueur de jouer
     */
    isThisPlayerTurn(playerId: string): boolean {
        return this.currentPlayer.getId() === playerId;
    }

    /**
     * Vérifie si les deux joueurs ont passé leur tour 3 fois de suite
     *
     * @returns Booléen qui indique si la partie est terminée
     */
    checkForEndGameAfterTakeTurn(): boolean {
        if (this.currentPlayer.passedTurn >= END_GAME_TURN_THRESHOLD && this.otherPlayer.passedTurn >= END_GAME_TURN_THRESHOLD) {
            this.currentPlayer.removeScore(this.currentPlayer.getEasel().getScore());
            this.otherPlayer.removeScore(this.otherPlayer.getEasel().getScore());
            return true;
        }
        return false;
    }

    /**
     * Vérifie si la réserve est vide et le chevalet du joueur courant aussi
     *
     * @returns Booléen qui indique si la partie est terminée
     */
    checkForEmptyReserveAndEasel(): boolean {
        if (this.reserve.isEmpty() && this.currentPlayer.getEasel().isEmpty()) {
            const easelScore = this.otherPlayer.getEasel().getScore();
            this.currentPlayer.addScore(easelScore);
            this.otherPlayer.removeScore(easelScore);
            return true;
        }
        return false;
    }

    /**
     * Augmente le score du joueur courant
     *
     * @param score Score à ajouter
     */
    addScore(score: number): void {
        this.currentPlayer.addScore(score);
    }

    /**
     * Augmente le score du joueur par rapport aux objectifs accomplis
     *
     * @param objectives Liste des objectifs de la partie
     */
    addScoreObjective(objectives: Objective[]) {
        for (const objective of objectives) {
            if (objective.checked && !objective.done) {
                this.currentPlayer.addScore(objective.points);
                objective.done = true;
            }
        }
    }

    /**
     * Passe le tour du joueur (c'est à l'autre joueur de jouer)
     *
     * @param byCommand Booléen qui indique si l'action est prise par une commande
     */
    takeTurn(byCommand: boolean): void {
        this.currentPlayer.passedTurn = byCommand ? ++this.currentPlayer.passedTurn : 0;
        const currentPlayer = this.currentPlayer;
        this.currentPlayer = this.otherPlayer;
        this.otherPlayer = currentPlayer;
        this.startTurn = new Date();
    }

    /**
     * Retourne le message de fin de partie
     *
     * @returns Message de fin de partie
     */
    getEndMessage(): string {
        let message = `Fin de partie - ${this.reserve.getSize()} lettres restantes\n`;
        message += `${this.currentPlayer.getName()}: ${this.currentPlayer
            .getEasel()
            .getContent()
            .map((l) => l.letter)
            .join('')}\n`;
        message += `${this.otherPlayer.getName()}: ${this.otherPlayer
            .getEasel()
            .getContent()
            .map((l) => l.letter)
            .join('')}`;
        return message;
    }

    /**
     * Échange des lettres entre le chevalet du joueur courant et la réserve
     *
     * @param letters Lettres à échanger
     * @param putBackInReserve Booléen qui indique s'il faut remettre les lettres dans la réserve
     */
    exchange(letters: Letter[], putBackInReserve: boolean): void {
        const easel = this.currentPlayer.getEasel();
        if (easel.containsLetters(letters)) {
            easel.removeLetters(letters);
            if (putBackInReserve) this.reserve.addLetters(letters);
            easel.addLetters(this.reserve.removeRandomLetters(letters.length));
        }
    }

    /**
     * Retourne les informations de la barre latérale
     *
     * @returns Informations de la barre latérale
     */
    getSidebarInformations(): SidebarInformations {
        if (this.placeRightPlayer) {
            this.placeRightPlayer = !this.placeRightPlayer;
            return {
                reserveSize: this.reserve.getSize(),
                currentPlayerId: this.currentPlayer.getId(),
                players: [
                    {
                        playerId: this.currentPlayer.getId(),
                        playerName: this.currentPlayer.getName(),
                        score: this.currentPlayer.getScore(),
                        easelSize: this.currentPlayer.getEasel().getSize(),
                    },
                    {
                        playerId: this.otherPlayer.getId(),
                        playerName: this.otherPlayer.getName(),
                        score: this.otherPlayer.getScore(),
                        easelSize: this.otherPlayer.getEasel().getSize(),
                    },
                ],
            };
        } else {
            this.placeRightPlayer = !this.placeRightPlayer;
            return {
                reserveSize: this.reserve.getSize(),
                currentPlayerId: this.currentPlayer.getId(),
                players: [
                    {
                        playerId: this.otherPlayer.getId(),
                        playerName: this.otherPlayer.getName(),
                        score: this.otherPlayer.getScore(),
                        easelSize: this.otherPlayer.getEasel().getSize(),
                    },
                    {
                        playerId: this.currentPlayer.getId(),
                        playerName: this.currentPlayer.getName(),
                        score: this.currentPlayer.getScore(),
                        easelSize: this.currentPlayer.getEasel().getSize(),
                    },
                ],
            };
        }
    }
}
