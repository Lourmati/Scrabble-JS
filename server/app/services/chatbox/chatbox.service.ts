import { ChatboxCommand } from '@app/classes/chatbox/chatbox-command';
import { ChatboxPlacement } from '@app/classes/chatbox/chatbox-placement';
import { Message } from '@app/classes/chatbox/message';
import { Exchange } from '@app/classes/game/exchange';
import { AXIS } from '@app/classes/grid/axis';
import * as CHATBOX from '@app/constants/chatbox';
import { GameService } from '@app/services/game/game.service';
import { ParseLettersService } from '@app/services/parse-letter/parse-letter.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { Service } from 'typedi';

@Service()
export class ChatboxService {
    private commands: ChatboxCommand[];

    constructor(
        private readonly socketCommunicationService: SocketCommunicationService,
        private readonly gameService: GameService,
        private readonly parseLetterService: ParseLettersService,
    ) {
        this.commands = [
            { filter: CHATBOX.REGEX_PLACE_WITH_ORIENTATION, handler: this.placeWithOrientation },
            { filter: CHATBOX.REGEX_PLACE_WITHOUT_ORIENTATION, handler: this.placeWithoutOrientation },
            { filter: CHATBOX.REGEX_EXCHANGE, handler: this.exchange },
            { filter: CHATBOX.REGEX_PASS, handler: this.takeTurn },
            { filter: CHATBOX.REGEX_RESERVE, handler: this.reserve },
            { filter: CHATBOX.REGEX_HINTS, handler: this.hints },
            { filter: CHATBOX.REGEX_HELP, handler: this.help },
        ];
    }

    /**
     * Gère la réception des messages
     *
     * @param message Message du joueur
     */
    handleMessage(message: Message): void {
        if (this.isCommand(message))
            if (this.isKnownCommand(message)) this.handleCommandFilters(message);
            else this.handleError(message, CHATBOX.ERROR_INVALID_COMMAND);
        else this.socketCommunicationService.emitToRoom(message.gameId, CHATBOX.CHATBOX_EVENT, message);
    }

    /**
     * Gère les commandes
     *
     * @param message Message du joueur
     */
    private handleCommandFilters(message: Message): void {
        for (const command of this.commands)
            if (command.filter.test(message.content)) {
                command.handler.call(this, message);
                return;
            }
        this.handleError(message, CHATBOX.ERROR_SYNTAX);
    }

    /**
     * Gère les erreurs dans les commandes
     *
     * @param message Message du joueur
     * @param content Message d'erreur
     */
    private handleError(message: Message, content: string): void {
        this.socketCommunicationService.emitToSocket(message.playerId, CHATBOX.CHATBOX_EVENT, this.createServerMessage(message.gameId, content));
    }

    /**
     * Indique si le message est une commande
     *
     * @param message Message du joueur
     * @returns Booléen qui indique si le message est une commande
     */
    private isCommand(message: Message): boolean {
        return CHATBOX.REGEX_COMMAND.test(message.content);
    }

    /**
     * Indique si la commande est connue
     *
     * @param message Message du joueur
     * @returns Booléen qui indique si la commande est connue
     */
    private isKnownCommand(message: Message): boolean {
        return CHATBOX.COMMANDS_LIST.includes(this.getCommand(message));
    }

    /**
     * Retourne la commande contenue dans le message
     *
     * @param message Message du joueur
     * @returns Commande contenue dans le message
     */
    private getCommand(message: Message): string {
        const match = message.content.match(CHATBOX.REGEX_COMMAND);
        return match && match.length > 1 ? match[1] : '';
    }

    /**
     * Créé un message émis depuis le serveur
     *
     * @param gameId Identifiant de la partie
     * @param content Message à envoyer
     * @returns Message du serveur
     */
    private createServerMessage(gameId: string, content: string): Message {
        return { gameId, playerId: CHATBOX.SERVER_ID, playerName: CHATBOX.SERVER_NAME, content };
    }

    /**
     * Extrait le placement du message
     *
     * @param message Message du joueur
     * @param withOrientation Boolean qui indique si l'orientation doit être prise en compte
     * @returns Placement du message
     */
    private extractPlacement(message: string, withOrientation: boolean): ChatboxPlacement {
        const match = message.match(withOrientation ? CHATBOX.REGEX_PLACE_WITH_ORIENTATION : CHATBOX.REGEX_PLACE_WITHOUT_ORIENTATION);
        if (!match) return null as unknown as ChatboxPlacement;
        return {
            position: {
                x: match[CHATBOX.INDEX_X_POSITION].charCodeAt(0) - CHATBOX.A_LETTER_PADDING,
                y: parseInt(match[CHATBOX.INDEX_Y_POSITION], CHATBOX.DECIMAL_BASE),
            },
            axis: !withOrientation || match[CHATBOX.INDEX_ORIENTATION] === CHATBOX.HORIZONTAL_CHAR ? AXIS.HORIZONTAL : AXIS.VERTICAL,
            letters: this.parseLetterService.parseLetters(match[withOrientation ? CHATBOX.INDEX_LETTERS : CHATBOX.INDEX_LETTERS - 1]),
        };
    }

    /**
     * Effectue un placement avec orientation
     *
     * @param message Message du joueur
     */
    private placeWithOrientation(message: Message): void {
        const placement: ChatboxPlacement = this.extractPlacement(message.content, true);
        this.place(message, placement);
    }

    /**
     * Effectue un placement sans orientation
     *
     * @param message Message du joueur
     */
    private placeWithoutOrientation(message: Message): void {
        const placement: ChatboxPlacement = this.extractPlacement(message.content, false);
        this.place(message, placement);
    }

    /**
     * Effectue un placement de lettres
     * Syntaxe : !placer <ligne><colonne>[(h|v)] <lettres>
     *
     * @param message Message du joueur
     * @param placement Placement à effectuer
     */
    private place(message: Message, placement: ChatboxPlacement): void {
        if (this.gameService.place(message.gameId, message.playerId, placement))
            this.socketCommunicationService.emitToRoom(message.gameId, CHATBOX.CHATBOX_EVENT, message);
        else this.handleError(message, CHATBOX.ERROR_PLACEMENT);
    }

    /**
     * Effectue un échange de lettres
     * Syntaxe : !échange <lettres>
     *
     * @param message Message du joueur
     */
    private exchange(message: Message): void {
        const match = message.content.match(CHATBOX.REGEX_EXCHANGE);
        const letters: string = match && match.length > 1 ? match[1] : '';
        const exchange: Exchange = { letters: this.parseLetterService.parseLetters(letters) };
        if (this.gameService.exchange(message.gameId, message.playerId, exchange)) {
            this.socketCommunicationService.emitToSocket(message.playerId, CHATBOX.CHATBOX_EVENT, message);
            this.socketCommunicationService.emitToRoomButSocket(
                message.playerId,
                message.gameId,
                CHATBOX.CHATBOX_EVENT,
                this.createServerMessage(message.gameId, message.content.replace(letters, letters.length.toString())),
            );
        } else this.handleError(message, CHATBOX.ERROR_EXCHANGE);
    }

    /**
     * Passe le tour du joueur
     * Syntaxe : !passer
     *
     * @param message Message du joueur
     */
    private takeTurn(message: Message): void {
        if (this.gameService.takeTurn(message.gameId, message.playerId)) {
            this.socketCommunicationService.emitToRoom(message.gameId, CHATBOX.CHATBOX_EVENT, message);
        } else this.handleError(message, CHATBOX.ERROR_NOT_YOUR_TURN);
    }

    /**
     * Envoie une liste d'indices de placement au joueur
     * Syntaxe : !indice
     *
     * @param message Message du joueur
     */
    private hints(message: Message): void {
        if (this.gameService.isThisPlayerTurn(message.gameId, message.playerId)) {
            let hints = this.gameService.hints(message.gameId, message.playerId);
            if (hints.length === 0) hints = CHATBOX.ERROR_NO_HINTS;
            this.socketCommunicationService.emitToSocket(message.playerId, CHATBOX.CHATBOX_EVENT, this.createServerMessage(message.gameId, hints));
        } else this.handleError(message, CHATBOX.ERROR_NOT_YOUR_TURN);
    }

    /**
     * Envoie le contenu de la réserve au joueur
     * Syntaxe : !réserve
     *
     * @param message Message du joueur
     */
    private reserve(message: Message): void {
        this.socketCommunicationService.emitToSocket(
            message.playerId,
            CHATBOX.CHATBOX_EVENT,
            this.createServerMessage(message.gameId, this.gameService.reserve(message.gameId)),
        );
    }

    /**
     * Envoie un message d'aide au joueur
     *
     * @param message Message du joueur
     */
    private help(message: Message): void {
        this.socketCommunicationService.emitToSocket(
            message.playerId,
            CHATBOX.CHATBOX_EVENT,
            this.createServerMessage(message.gameId, CHATBOX.CHATBOX_HELP_MESSAGE),
        );
    }
}
