import { Game } from '@app/classes/game/game';
import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';
import { CHATBOX_EVENT, SERVER_ID, SERVER_NAME } from '@app/constants/chatbox';
import {
    EVENT_EASEL_UPDATED,
    EVENT_GAME_ENDED,
    EVENT_GRID_UPDATED,
    EVENT_OBJECTIVES_UPDATED,
    EVENT_PRIVATE_OBJECTIVE_UPDATED,
    EVENT_SIDEBAR_UPDATED,
    SURRENDER_MESSAGE,
} from '@app/constants/game';
import {
    OBJECTIVES_1,
    OBJECTIVES_2,
    OBJECTIVES_3,
    OBJECTIVES_4,
    OBJECTIVES_5,
    OBJECTIVES_6,
    OBJECTIVES_7,
    OBJECTIVES_8,
} from '@app/constants/objectives';
import { ObjectivesService } from '@app/services/objectives/objectives.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { Service } from 'typedi';

@Service()
export class UpdateService {
    constructor(private readonly socketCommunicationService: SocketCommunicationService, private readonly objectivesService: ObjectivesService) {}
    /**
     * Met à jour les clients
     *
     * @param game Partie à mettre à jour
     */
    updateClient(game: Game): void {
        this.updateGrid(game);
        this.updateEasel(game);
        this.updateSidebar(game);
    }

    /**
     * Met à jour les objectifs
     *
     * @param game Partie à mettre à jour
     */
    updateObjectives(game: Game): void {
        const publicObjectives: Objective[] = [];
        for (const objective of game.objectives) this.emitObjectives(objective, publicObjectives);
        this.socketCommunicationService.emitToRoom(game.id, EVENT_OBJECTIVES_UPDATED, publicObjectives);
    }

    /**
     * Met à jour le statut des objectifs
     *
     * @param game Partie à mettre à jour
     * @param placedWords Mots placés
     */
    updateObjectivesEachTurn(game: Game, placedWords: string[]): void {
        for (const objective of game.objectives) {
            if (objective.type === ObjectiveType.PRIVATE && objective.id !== game.currentPlayer.getId()) continue;
            switch (objective.code) {
                case OBJECTIVES_1:
                    objective.checked = this.objectivesService.wordContainsFourVowels(placedWords);
                    break;
                case OBJECTIVES_2:
                    objective.checked = this.objectivesService.hundredPointsWithoutExchangeOrHint(
                        game.currentPlayer.getScore(),
                        game.currentPlayer.usedExchange || game.currentPlayer.usedHints,
                    );
                    break;
                case OBJECTIVES_3:
                    objective.checked = this.objectivesService.placementLessFiveSeconds(new Date().getSeconds() - game.startTurn.getSeconds());
                    break;

                case OBJECTIVES_4:
                    objective.checked = this.objectivesService.wordIsPalindrome(placedWords);
                    break;
                case OBJECTIVES_5:
                    objective.checked = this.objectivesService.wordContainsNoConsonants(placedWords);
                    break;
                case OBJECTIVES_6:
                    objective.checked = this.objectivesService.wordBeginsAndEndsWithVowel(placedWords);
                    break;
                case OBJECTIVES_7:
                    objective.checked = this.objectivesService.positionO15Filled(game.grid.boxes);
                    break;
                case OBJECTIVES_8:
                    objective.checked = this.objectivesService.wordIsAnagram(placedWords, game.allPlacedWords);
                    break;
            }
        }
    }

    /**
     * Informe l'autre joueur qu'un joueur a abandonné la partie
     *
     * @param game Partie à mettre à jour
     * @param playerId Identifiant du joueur qui a abandonné
     */
    updateAfterSurrender(game: Game, playerId: string): void {
        this.socketCommunicationService.emitToRoomButSocket(playerId, game.id, CHATBOX_EVENT, {
            gameId: game.id,
            playerId: SERVER_ID,
            playerName: SERVER_NAME,
            content: SURRENDER_MESSAGE,
        });
    }

    /**
     * Met à jour les scores en fin de partie
     *
     * @param game Partie à mettre à jour
     */
    updateEndScores(game: Game): void {
        this.socketCommunicationService.emitToRoom(game.id, EVENT_GAME_ENDED, [
            { player: { id: game.currentPlayer.getId(), name: game.currentPlayer.getName() }, score: game.currentPlayer.getScore() },
            { player: { id: game.otherPlayer.getId(), name: game.otherPlayer.getName() }, score: game.otherPlayer.getScore() },
        ]);
    }

    /**
     * Met à jour les chevalets
     *
     * @param game Partie à mettre à jour
     */
    private updateEasel(game: Game): void {
        this.socketCommunicationService.emitToSocket(game.currentPlayer.getId(), EVENT_EASEL_UPDATED, game.currentPlayer.getEasel().getContent());
        this.socketCommunicationService.emitToSocket(game.otherPlayer.getId(), EVENT_EASEL_UPDATED, game.otherPlayer.getEasel().getContent());
    }

    /**
     * Met à jour la grille
     *
     * @param game Partie à mettre à jour
     */
    private updateGrid(game: Game): void {
        this.socketCommunicationService.emitToRoom(game.id, EVENT_GRID_UPDATED, game.grid);
    }

    /**
     * Met à jour la barre latérale
     *
     * @param game Partie à mettre à jour
     */
    private updateSidebar(game: Game): void {
        this.socketCommunicationService.emitToRoom(game.id, EVENT_SIDEBAR_UPDATED, game.getSidebarInformations());
    }

    /**
     * Met à jour l'objectif privé
     *
     * @param objective Objectif à tester
     * @param publicObjectives Objectifs publics
     */
    private emitObjectives(objective: Objective, publicObjectives: Objective[]): void {
        if (objective.type === ObjectiveType.PUBLIC) publicObjectives.push(objective);
        else this.socketCommunicationService.emitToSocket(objective.id, EVENT_PRIVATE_OBJECTIVE_UPDATED, objective);
    }
}
