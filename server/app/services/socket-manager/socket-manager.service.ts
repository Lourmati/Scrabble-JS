import { Message } from '@app/classes/chatbox/message';
import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { EVENT_AVAILABLE_ROOMS_UPDATED } from '@app/constants/room';
import * as SOCKET from '@app/constants/socket';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Service } from 'typedi';
@Service()
export class SocketManagerService {
    private sio: Server;

    constructor(
        private readonly roomService: RoomService,
        private readonly chatboxService: ChatboxService,
        private readonly gameService: GameService,
        private readonly socketCommunicationService: SocketCommunicationService,
        private readonly dictionaryService: DictionaryService,
    ) {}

    /**
     * Créé un serveur de communication (SocketIO)
     *
     * @param server Serveur HTTP
     */
    createSocketServer(server: http.Server): void {
        this.sio = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.socketCommunicationService.setServer(this.sio);
    }

    /**
     * Initialise les événements du serveur
     */
    handleSockets(): void {
        this.sio.on('connection', (socket: Socket) => {
            socket.on(SOCKET.EVENT_ROOM_CREATE, (name: string, gameParameters: GameParameters) => {
                this.roomService.create({ name, id: socket.id }, gameParameters);
            });
            socket.on(SOCKET.EVENT_ROOM_CANCEL, () => {
                this.roomService.delete(socket.id);
            });
            socket.on(SOCKET.EVENT_ROOM_JOIN_REQUEST, (guest: PlayerInformations, roomId: string) => {
                this.roomService.joinRequest(guest, roomId);
            });
            socket.on(SOCKET.EVENT_ROOM_CANCEL_JOIN_REQUEST, (roomId: string) => {
                this.roomService.cancelJoinRequest(roomId);
            });
            socket.on(SOCKET.EVENT_ROOM_ACCEPT_JOIN_REQUEST, () => {
                this.roomService.acceptJoinRequest(socket.id);
            });
            socket.on(SOCKET.EVENT_ROOM_REJECT_JOIN_REQUEST, () => {
                this.roomService.rejectJoinRequest(socket.id);
            });
            socket.on(SOCKET.EVENT_ROOM_AVAILABLE_ROOMS_REQUEST, (gameMode: GameMode) => {
                socket.emit(EVENT_AVAILABLE_ROOMS_UPDATED, this.roomService.getAvailableRooms(gameMode));
            });
            socket.on(SOCKET.EVENT_GAME_CREATE_SOLO, (name: string, gameParameters: GameParameters, level: VirtualPlayerLevel) => {
                this.gameService.createSoloGame({ name, id: socket.id }, gameParameters, level);
            });
            socket.on(SOCKET.EVENT_CHATBOX_MESSAGE, (message: Message) => {
                this.chatboxService.handleMessage(message);
            });
            socket.on(SOCKET.EVENT_GAME_SURRENDER, (gameId: string) => {
                this.gameService.surrender(gameId, socket.id);
            });
            socket.on(SOCKET.EVENT_DICTIONARY_UPDATE, () => {
                this.dictionaryService.updateAvailableDictionaries();
            });
            socket.on(SOCKET.EVENT_DISCONNECT, () => {
                this.gameService.surrenderAfterClosingTab(socket.id);
            });
        });
    }
}
