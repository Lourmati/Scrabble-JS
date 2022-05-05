import { GameMode } from '@app/classes/game/game-mode';
import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { Room } from '@app/classes/room/room';
import { RoomInformations } from '@app/classes/room/room-informations';
import * as ROOM from '@app/constants/room';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { GameService } from '@app/services/game/game.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { Service } from 'typedi';

@Service()
export class RoomService {
    rooms: Map<string, Room>;

    constructor(
        private readonly socketCommunicationService: SocketCommunicationService,
        private readonly gameService: GameService,
        private readonly dictionaryService: DictionaryService,
    ) {
        this.rooms = new Map<string, Room>();
    }

    /**
     * Retourne la liste des salle disponibles
     *
     * @param gameMode Mode de jeu
     * @returns Liste des salle disponibles
     */
    getAvailableRooms(gameMode: GameMode): RoomInformations[] {
        return Array.from(this.rooms.values())
            .filter((room) => this.isRoomAvailable(room.id) && room.parameters.mode === gameMode)
            .map((room) => {
                return {
                    id: room.id,
                    playerName: room.host.name,
                    parameters: {
                        dictionary: this.dictionaryService.getTitle(room.parameters.dictionary),
                        mode: room.parameters.mode,
                        timer: room.parameters.timer,
                    },
                };
            });
    }

    /**
     * Met à jour la liste des salle disponibles sur tous les clients connectés
     */
    updateAvailableRooms(): void {
        this.socketCommunicationService.emitToBroadcast(ROOM.EVENT_AVAILABLE_ROOMS_UPDATED, this.getAvailableRooms(GameMode.CLASSIC));
        this.socketCommunicationService.emitToBroadcast(ROOM.EVENT_AVAILABLE_ROOMS_UPDATED, this.getAvailableRooms(GameMode.LOG2990));
    }

    /**
     * Créé une salle
     *
     * @param host Informations du joueur hôte
     * @param gameParameters Paramètres de la partie
     */
    create(host: PlayerInformations, gameParameters: GameParameters): void {
        const room: Room = new Room(host.id, host, gameParameters);
        this.dictionaryService.useDictionary(host.id, room.parameters.dictionary);
        this.rooms.set(host.id, room);
        this.updateAvailableRooms();
    }

    /**
     * Supprime une salle
     *
     * @param id Identifiant de la salle
     */
    delete(id: string): void {
        const room: Room | undefined = this.rooms.get(id);
        if (!room) return;
        if (room.isFull()) this.socketCommunicationService.emitToSocket(room.guest.id, ROOM.EVENT_JOIN_REQUEST_REJECTED);
        this.dictionaryService.releaseDictionary(id, room.parameters.dictionary);
        this.rooms.delete(id);
        this.updateAvailableRooms();
    }

    /**
     * Traite une requête d'un invité de rejoindre une salle
     *
     * @param guest Informations du joueur invité
     * @param id Identifiant de la salle
     */
    joinRequest(guest: PlayerInformations, id: string): void {
        const room: Room | undefined = this.rooms.get(id);
        if (room && this.isRoomAvailable(id)) {
            room.addGuest(guest);
            this.socketCommunicationService.emitToRoom(id, ROOM.EVENT_JOIN_REQUESTED, guest);
        } else {
            this.socketCommunicationService.emitToSocket(guest.id, ROOM.EVENT_JOIN_REQUEST_ABORTED, guest);
            this.updateAvailableRooms();
        }
    }

    /**
     * Annule la requête d'un joueur de rejoindre une salle
     *
     * @param id Identifiant de la salle
     */
    cancelJoinRequest(id: string): void {
        this.rooms.get(id)?.removeGuest();
        this.socketCommunicationService.emitToRoom(id, ROOM.EVENT_JOIN_REQUEST_CANCELED);
    }

    /**
     * Accepte la requête d'un joueur de rejoindre une salle
     *
     * @param id Identifiant de la salle
     */
    acceptJoinRequest(id: string): void {
        const room: Room | undefined = this.rooms.get(id);
        if (room && room.isFull()) {
            this.socketCommunicationService.joinRoom(room.guest.id, id);
            this.socketCommunicationService.emitToRoom(id, ROOM.EVENT_GAME_STARTED, { gameId: id, timer: room.parameters.timer });
            this.gameService.createMultiplayerGame(room.parameters, room.host, room.guest);
        } else {
            this.socketCommunicationService.emitToSocket(id, ROOM.EVENT_JOIN_REQUEST_CANCELED);
        }
    }

    /**
     * Rejette la requête d'un joueur de rejoindre une salle
     *
     * @param id Identifiant de la salle
     */
    rejectJoinRequest(id: string): void {
        const room: Room | undefined = this.rooms.get(id);
        if (room) {
            this.socketCommunicationService.emitToSocket(room.guest.id, ROOM.EVENT_JOIN_REQUEST_REJECTED);
            room.removeGuest();
        }
    }

    /**
     * Indique si la salle est pleine (2 joueurs)
     *
     * @param roomId Identifiant de la salle
     * @returns
     */
    private isRoomAvailable(roomId: string): boolean {
        return this.rooms.has(roomId) && !(this.rooms.get(roomId)?.isFull() ?? true);
    }
}
