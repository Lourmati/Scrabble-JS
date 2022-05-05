/* eslint-disable max-lines */
import { ChatboxPlacement } from '@app/classes/chatbox/chatbox-placement';
import { Letter } from '@app/classes/common/letter';
import { Exchange } from '@app/classes/game/exchange';
import { Game } from '@app/classes/game/game';
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { GameType } from '@app/classes/game/game-type';
import { AXIS } from '@app/classes/grid/axis';
import { Box } from '@app/classes/grid/box';
import { Placement } from '@app/classes/grid/placement';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { ScoreConstraint } from '@app/classes/virtual-player/score-constraints';
import { VirtualPlayer } from '@app/classes/virtual-player/virtual-player';
import { VirtualPlayerCommand } from '@app/classes/virtual-player/virtual-player-commands';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { MODE_CLASSIQUE, MODE_LOG2990 } from '@app/constants/best-scores';
import { A_LETTER_PADDING, CHATBOX_EVENT, SERVER_ID, SERVER_NAME } from '@app/constants/chatbox';
import { COMMAND_EXCHANGE, COMMAND_PLACE, COMMAND_TAKE_TURN, SURRENDER_AFTER_DISCONNECT_DELAY } from '@app/constants/game';
import { RESERVE_MIN_SIZE, STAR } from '@app/constants/reserve';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { ObjectivesManagerService } from '@app/services/objectives-manager/objectives-manager.service';
import { PlacementGeneratorService } from '@app/services/placement-generator/placement-generator.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { PlacementValidationService } from '@app/services/placement-validation/placement-validation.service';
import { ScoreHandler } from '@app/services/score-handler/score-handler.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { UpdateService } from '@app/services/update/update.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { Service } from 'typedi';

@Service()
export class GameService {
    private games: Map<string, Game>;
    constructor(
        private readonly socketCommunicationService: SocketCommunicationService,
        private readonly wordValidationService: PlacementValidationService,
        private readonly placementGenerationService: PlacementGeneratorService,
        private readonly placementService: PlacementService,
        private readonly virtualPlayerService: VirtualPlayerService,
        private readonly updateService: UpdateService,
        private readonly highScoreService: ScoreHandler,
        private readonly objectivesManagerService: ObjectivesManagerService,
        private readonly gameHistoryService: GameHistoryService,
        private readonly dictionaryService: DictionaryService,
    ) {
        this.games = new Map();
    }

    /**
     * Créé une partie multijoueur
     *
     * @param parameters Paramètres de la partie
     * @param host Informations du joueur hôte
     * @param guest Informations du joueur invité
     */
    createMultiplayerGame(parameters: GameParameters, host: PlayerInformations, guest: PlayerInformations): void {
        const game = new Game(host, parameters, GameType.MULTIPLAYER);
        if (game.parameters.mode === GameMode.LOG2990) {
            game.setObjectives(this.objectivesManagerService.getGameObjectives(), [host.id, guest.id]);
        }
        game.setPlayersMultiplayer(host, guest);
        this.games.set(host.id, game);
        this.updateService.updateObjectives(game);
        this.updateService.updateClient(game);
    }

    /**
     * Créé une partie solo
     *
     * @param player Information du joueur hôte
     * @param parameters Paramètres de la partie
     */
    async createSoloGame(player: PlayerInformations, parameters: GameParameters, level: VirtualPlayerLevel): Promise<void> {
        const game: Game = new Game(player, parameters, GameType.SOLO);
        this.dictionaryService.useDictionary(game.id, parameters.dictionary);
        game.setPlayersSolo(player, await this.virtualPlayerService.getRandomName(player.name, level), level);
        if (game.parameters.mode === GameMode.LOG2990) {
            game.setObjectives(this.objectivesManagerService.getGameObjectives(), [player.id, 'id']);
        }
        this.games.set(player.id, game);
        this.updateService.updateObjectives(game);
        this.updateService.updateClient(game);
    }

    /**
     * Place des lettres sur la grille
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     * @param placement Placement a effectuer
     * @returns Booléen qui indique si le placement a été effectué
     */
    place(gameId: string, playerId: string, placement: ChatboxPlacement): boolean {
        const game: Game | undefined = this.games.get(gameId);
        if (!game) return false;
        if (!game.isThisPlayerTurn(playerId)) return false;
        const easelLetters = this.handlePlacementWithStar(placement);
        if (!game.currentPlayer.haveLetters(easelLetters)) return false;
        if (!this.placeLetters(game, placement)) return false;
        game.exchange(easelLetters, false);
        if (game.checkForEmptyReserveAndEasel()) this.handleEndGame(game);
        else game.takeTurn(false);
        this.updateService.updateClient(game);
        if (this.isVirtualPlayerTurn(game)) this.virtualPlayerAction(game);
        return true;
    }

    /**
     * Échange des lettres du chevalet avec la réserve
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     * @param exchange Échange à effectuer
     * @returns Booléen qui indique si l'échange a été effectué
     */
    exchange(gameId: string, playerId: string, exchange: Exchange): boolean {
        const game: Game | undefined = this.games.get(gameId);
        if (!game) return false;
        if (!game.isThisPlayerTurn(playerId)) return false;
        if (game.reserve.getSize() < RESERVE_MIN_SIZE) return false;
        game.exchange(exchange.letters, true);
        game.currentPlayer.usedExchange = true;
        game.takeTurn(false);
        this.updateService.updateClient(game);
        if (this.isVirtualPlayerTurn(game)) this.virtualPlayerAction(game);
        return true;
    }

    /**
     * Passe le tour du joueur courant
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     * @returns Booléen qui indique si le tour a été passé
     */
    takeTurn(gameId: string, playerId: string): boolean {
        const game: Game | undefined = this.games.get(gameId);
        if (!game) return false;
        if (!game.isThisPlayerTurn(playerId)) return false;
        game.takeTurn(true);
        if (game.checkForEndGameAfterTakeTurn()) this.handleEndGame(game);
        this.updateService.updateClient(game);
        if (this.isVirtualPlayerTurn(game)) this.virtualPlayerAction(game);
        return true;
    }

    /**
     * Retourne le contenu de la réserve
     *
     * @param gameId Identifiant de la partie
     * @returns Contenu de la réserve
     */
    reserve(gameId: string): string {
        return this.games.get(gameId)?.reserve.getFormattedContent() || '';
    }

    /**
     * Retourne des indices de placement pour le joueur courant
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     * @returns Liste d'indices pour le joueur
     */
    hints(gameId: string, playerId: string): string {
        const game: Game | undefined = this.games.get(gameId);
        if (!game) return '';
        if (!game.isThisPlayerTurn(playerId)) return '';
        const placements: Placement[] = this.placementGenerationService.generatePlacements(gameId, {
            easel: game.currentPlayer.getEasel().getContentAsString(),
            grid: game.grid.boxes,
            isGridEmpty: game.isGridEmpty,
        });
        game.currentPlayer.usedHints = true;
        return placements.map((p: Placement) => this.placementToCommand(p)).join('\n');
    }

    /**
     * Gère la fin de partie (message, félicitations, etc.)
     *
     * @param game Partie terminée
     */
    handleEndGame(game: Game): void {
        const duration = game.end();
        this.socketCommunicationService.emitToRoom(game.id, CHATBOX_EVENT, {
            gameId: game.id,
            playerId: SERVER_ID,
            playerName: SERVER_NAME,
            content: game.getEndMessage(),
        });
        this.updateService.updateEndScores(game);
        this.setScores(game);
        const cp = game.currentPlayer;
        const op = game.otherPlayer;
        this.gameHistoryService.addGame({
            id: game.id,
            start: game.start,
            duration,
            players: [
                { player: { id: cp.getId(), name: cp.getName() }, score: cp.getScore() },
                { player: { id: op.getId(), name: op.getName() }, score: op.getScore() },
            ],
            gameMode: game.parameters.mode,
        });
        this.dictionaryService.releaseDictionary(game.id, game.parameters.dictionary);
        this.games.delete(game.id);
    }
    /**
     * Indique si c'est à ce joueur de jouer
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     * @returns Booléen qui indique si c'est à ce joueur de jouer
     */
    isThisPlayerTurn(gameId: string, playerId: string): boolean {
        return this.games.get(gameId)?.isThisPlayerTurn(playerId) || false;
    }

    /**
     * Indique si c'est au joueur virtuel de jouer
     *
     * @param game Partie à vérifier
     * @returns Booléen qui indique si c'est au joueur virtuel du jouer
     */
    isVirtualPlayerTurn(game: Game): boolean {
        return game.type === GameType.SOLO && game.currentPlayer instanceof VirtualPlayer;
    }

    surrenderAfterClosingTab(playerId: string): void {
        setTimeout(() => {
            const gameId = this.getGameIdFromPlayerId(playerId);
            this.surrender(gameId, playerId);
        }, SURRENDER_AFTER_DISCONNECT_DELAY);
    }

    /**
     * Gère l'abandon d'une partie
     *
     * @param gameId Identifiant de la partie
     * @param playerId Identifiant du joueur
     */
    async surrender(gameId: string, playerId: string): Promise<void> {
        const game: Game | undefined = this.games.get(gameId);
        if (!game) return;
        if (game.type === GameType.MULTIPLAYER) {
            const easel = (game.isThisPlayerTurn(playerId) ? game.currentPlayer : game.otherPlayer).getEasel().getContent();
            const score = (game.isThisPlayerTurn(playerId) ? game.currentPlayer : game.otherPlayer).getScore();
            if (game.isThisPlayerTurn(playerId)) game.currentPlayer = game.otherPlayer;
            game.otherPlayer = new VirtualPlayer(
                await this.virtualPlayerService.getRandomName(game.currentPlayer.getName(), VirtualPlayerLevel.BEGINNER),
                easel,
                VirtualPlayerLevel.BEGINNER,
            );
            game.otherPlayer.addScore(score);
            game.type = GameType.SOLO;
            this.updateService.updateClient(game);
            this.updateService.updateAfterSurrender(game, playerId);
        } else {
            this.dictionaryService.releaseDictionary(game.id, game.parameters.dictionary);
            this.games.delete(gameId);
        }
    }

    /**
     * Effectue une action de la part du joueur virtuels
     *
     * @param game Partie dans laquelle le joueur virtuel doit jouer
     */
    virtualPlayerAction(game: Game): void {
        const command: VirtualPlayerCommand = (game.currentPlayer as VirtualPlayer).getCommand();
        if (command === VirtualPlayerCommand.EXCHANGE) this.virtualPlayerExchange(game);
        else if (command === VirtualPlayerCommand.PLACE) this.virtualPlayerPlace(game);
        else this.virtualPlayerTakeTurn(game);
    }

    /**
     * Trouve l'identifiant d'une partie à partir de celui du joueur
     *
     * @param playerId Identifiant du joueur
     * @returns Identifiant de la partie
     */
    getGameIdFromPlayerId(playerId: string): string {
        if (this.games.has(playerId)) return playerId;
        for (const game of this.games.values()) if (game.currentPlayer.getId() === playerId || game.otherPlayer.getId() === playerId) return game.id;
        return '';
    }

    /**
     * Ajoute le score des joueurs réels au tableau des scores
     *
     * @param game Partie terminée
     */
    private setScores(game: Game): void {
        if (game.type === GameType.MULTIPLAYER || !(game.currentPlayer instanceof VirtualPlayer)) {
            const player = game.currentPlayer;
            this.highScoreService.setScore({
                name: [player.getName()],
                score: player.getScore(),
                playerMode: game.parameters.mode === GameMode.CLASSIC ? MODE_CLASSIQUE : MODE_LOG2990,
            });
        }
        if (game.type === GameType.MULTIPLAYER || !(game.otherPlayer instanceof VirtualPlayer)) {
            const player = game.otherPlayer;
            this.highScoreService.setScore({
                name: [player.getName()],
                score: player.getScore(),
                playerMode: game.parameters.mode === GameMode.CLASSIC ? MODE_CLASSIQUE : MODE_LOG2990,
            });
        }
    }

    /**
     * Traite un placement avec une étoile
     *
     * @param placement Placement à effectuer
     * @returns Lettre du placement avec étoile
     */
    private handlePlacementWithStar(placement: ChatboxPlacement): Letter[] {
        const easelPlacementLetters: Letter[] = [];
        for (const letter of placement.letters)
            if (letter.letter === letter.letter.toLocaleUpperCase()) {
                letter.letter = letter.letter.toLocaleLowerCase();
                easelPlacementLetters.push({ letter: STAR, point: letter.point });
            } else easelPlacementLetters.push(letter);
        return easelPlacementLetters;
    }

    /**
     * Place les lettres sur la grille si le placement est valide
     *
     * @param game Partie en cours
     * @param chatboxPlacement Le placement à effectuer
     * @returns Booléen qui indique si les lettres ont été placées
     */
    private placeLetters(game: Game, chatboxPlacement: ChatboxPlacement): boolean {
        const placement: Placement = { ...chatboxPlacement, letters: chatboxPlacement.letters.map((l) => l.letter).join('') };
        const placementResult = this.wordValidationService.isPlacementValid(game.id, game.grid.boxes, placement, game.isGridEmpty);
        if (!placementResult.validity) return false;
        game.grid.boxes = this.placementService.placeLetters(game.grid.boxes, placement).boxes;
        game.addScore(placementResult.score);
        game.isGridEmpty = false;
        const placedWords = this.placementService.boxArrayToStringArray(placementResult.placedWords);
        game.allPlacedWords.push.apply(game.allPlacedWords, placedWords);
        this.updateService.updateObjectivesEachTurn(game, placedWords);
        game.addScoreObjective(game.objectives);
        this.updateService.updateObjectives(game);
        return true;
    }

    /**
     * Transforme un placement en commande
     *
     * @param placement Le placement à transformer
     * @returns La commande correspondante
     */
    private placementToCommand(placement: Placement): string {
        return `${COMMAND_PLACE} ${String.fromCharCode(placement.position.x + A_LETTER_PADDING)}${placement.position.y}${
            placement.axis === AXIS.HORIZONTAL ? AXIS.HORIZONTAL : AXIS.VERTICAL
        } ${placement.letters}`;
    }

    /**
     * Le joueur virtuel passe son tour
     *
     * @param game Partie en cours
     */
    private virtualPlayerTakeTurn(game: Game): void {
        this.takeTurn(game.id, game.currentPlayer.getId());
        this.socketCommunicationService.emitToRoom(game.id, CHATBOX_EVENT, this.virtualPlayerService.createMessage(game, COMMAND_TAKE_TURN));
    }

    /**
     * Le joueur virtuel échange des lettres
     *
     * @param game Partie en cours
     */
    private virtualPlayerExchange(game: Game): void {
        const virtualPlayer: VirtualPlayer = game.currentPlayer as VirtualPlayer;
        const exchange: Exchange = virtualPlayer.getExchange(virtualPlayer.level, game.reserve.getSize());
        if (!this.exchange(game.id, game.currentPlayer.getId(), exchange)) {
            this.takeTurn(game.id, game.currentPlayer.getId());
            this.socketCommunicationService.emitToRoom(game.id, CHATBOX_EVENT, COMMAND_TAKE_TURN);
        } else {
            const id = game.currentPlayer.getId();
            const msgCurrent = COMMAND_EXCHANGE + ' ' + exchange.letters.map((l) => l.letter).join('');
            const msgOther = COMMAND_EXCHANGE + ' ' + exchange.letters.length.toString();
            this.socketCommunicationService.emitToSocket(id, CHATBOX_EVENT, this.virtualPlayerService.createMessage(game, msgCurrent));
            this.socketCommunicationService.emitToRoomButSocket(id, game.id, CHATBOX_EVENT, this.virtualPlayerService.createMessage(game, msgOther));
        }
    }

    /**
     * Le joueur virtuel place des lettres
     *
     * @param game Partie en cours
     */
    private virtualPlayerPlace(game: Game): void {
        const virtualPlayer: VirtualPlayer = game.currentPlayer as VirtualPlayer;
        const constraints: ScoreConstraint = virtualPlayer.getScoreConstraint();
        const easel: string[] = game.currentPlayer.getEasel().getContentAsString();
        const grid: Box[][] = game.grid.boxes;
        const isGridEmpty: boolean = game.isGridEmpty;
        this.virtualPlayerService.getPlacements(game.id, { grid, easel, constraints, isGridEmpty }).then((placements) => {
            const placement: Placement = placements[Math.floor(Math.random() * placements.length)];
            if (!placement) {
                if (virtualPlayer.level === VirtualPlayerLevel.BEGINNER) this.virtualPlayerTakeTurn(game);
                else this.virtualPlayerExchange(game);
                return;
            }
            const chatboxPlacement = { ...placement, letters: placement.letters.split('').map((letter) => ({ letter, point: 0 })) };
            const command = this.placementToCommand(placement);
            if (!this.place(game.id, game.currentPlayer.getId(), chatboxPlacement)) this.virtualPlayerTakeTurn(game);
            else this.socketCommunicationService.emitToRoom(game.id, CHATBOX_EVENT, this.virtualPlayerService.createMessage(game, command));
        });
    }
}
