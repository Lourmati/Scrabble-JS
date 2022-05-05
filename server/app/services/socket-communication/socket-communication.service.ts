import { Server } from 'socket.io';
import { Service } from 'typedi';

@Service()
export class SocketCommunicationService {
    private sio: Server;

    /**
     * Définit le serveur de SocketIO
     *
     * @param server Serveur de communication (SocketIO)
     */
    setServer(server: Server): void {
        this.sio = server;
    }

    /**
     * Émet un événement à tous les joueurs de la salle
     *
     * @param roomId Identifiant de la salle
     * @param event Événement à émettre
     * @param data Données
     */
    emitToRoom(roomId: string, event: string, ...data: unknown[]): void {
        this.sio.to(roomId).emit(event, ...data);
    }

    /**
     * Émet un événement à destination de la socket
     *
     * @param socketId Identifiant de la socket
     * @param event Événement à émettre
     * @param data Données
     */
    emitToSocket(socketId: string, event: string, ...data: unknown[]): void {
        const socket = this.sio.sockets.sockets.get(socketId);
        if (socket) socket.emit(event, ...data);
    }

    /**
     * Émet un événement à tous les joueurs de la salle sauf l'envoyeur
     *
     * @param socketId Identifiant de la socket
     * @param roomId Identifiant de la salle
     * @param event Événement à émettre
     * @param data Données
     */
    emitToRoomButSocket(socketId: string, roomId: string, event: string, ...data: unknown[]): void {
        const socket = this.sio.sockets.sockets.get(socketId);
        if (socket) socket.to(roomId).emit(event, ...data);
    }

    /**
     * Émet un événement à tous les joueurs connectés
     *
     * @param event Événement à émettre
     * @param data Données
     */
    emitToBroadcast(event: string, ...data: unknown[]): void {
        this.sio.sockets.emit(event, ...data);
    }

    /**
     * Ajoute une socket dans une salle
     *
     * @param socketId Identifiant de la socket
     * @param roomId Identifiant de la salle
     */
    joinRoom(socketId: string, roomId: string): void {
        const socket = this.sio.sockets.sockets.get(socketId);
        if (socket) socket.join(roomId);
    }
}
