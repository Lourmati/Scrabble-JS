import { HttpException } from '@app/classes/http-exception/http.exception';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { DATABASE_COLLECTION, DUMMY_VP, ERROR_NUMBER, VirtualPlayer } from '@app/constants/virtual-player';
import { DatabaseService } from '@app/database/database/database.service';
import { Collection } from 'mongodb';
import 'reflect-metadata';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerNamesService {
    constructor(private databaseService: DatabaseService) {}

    get collection(): Collection<VirtualPlayer> {
        return this.databaseService.database.collection(DATABASE_COLLECTION);
    }

    /**
     * Retourne les noms des joueurs virtuels
     *
     * @param virtualPlayersLevel Niveau des joueurs virtuels
     * @returns Noms des joueurs virtuels
     */
    async getVirtualPlayerByLevel(virtualPlayersLevel: VirtualPlayerLevel): Promise<VirtualPlayer[]> {
        return this.collection
            .find({ level: virtualPlayersLevel })
            .toArray()
            .then((virtualPlayer: VirtualPlayer[]) => {
                return virtualPlayer;
            });
    }

    /**
     * Retournes les noms des joueurs virtuels
     *
     * @returns Noms des joueurs virtuels
     */
    async getVirtualPlayer(): Promise<VirtualPlayer[]> {
        return await this.collection.find().toArray();
    }

    /**
     * Ajoute un nom de joueur virtuel
     *
     * @param virtualPlayer Nom à ajouter
     */
    async addVirtualPlayer(virtualPlayer: VirtualPlayer): Promise<void> {
        await this.collection.insertOne(virtualPlayer);
    }

    /**
     * Supprime un nom de joueur virtuel
     *
     * @param virtualPlayer Nom à supprimer
     */
    async deleteVirtualPlayer(virtualPlayer: VirtualPlayer): Promise<void> {
        await this.collection.deleteOne(virtualPlayer);
    }

    /**
     * Cette méthode permet de get le joueur virtuel grace au nom passer en paramètre
     * Si le tableau n'est pas vide cela signifie que le joueur existe
     * Sinon le joueur n'existe pas
     *
     * @param virtualPlayerName est le nom du joueur virtuel
     * @returns un tableau de joueur virtuel
     */
    async getVirtualPlayerByName(virtualPlayerName: string): Promise<VirtualPlayer[]> {
        return this.collection
            .find({ name: virtualPlayerName })
            .toArray()
            .then((virtualPlayer: VirtualPlayer[]) => {
                return virtualPlayer;
            });
    }

    /**
     * Cette méthode permet de mettre a jour le noms du joueur avec un nouveau nom
     *
     * @param oldName est le nom du joueur virtuel avant la mise a jour
     * @param newName est le nom du joueur virtuel apres la mise a jour
     * @returns un tableau qui permet de verifier si le changement a bien ete effectue
     */
    async updateVirtualPlayerByName(oldName: string, newName: string): Promise<void> {
        return this.collection.updateOne({ name: oldName }, { $set: { name: newName } }).then();
    }

    /**
     * Supprime tous les noms des joueurs virtuels
     */
    async deleteAllVirtualPlayers(): Promise<void> {
        await this.collection.deleteMany({});
    }

    /**
     * Ajoute des joueurs virtuels de test
     */
    async addDummyVirtualPlayers(): Promise<void> {
        await this.collection.insertMany(DUMMY_VP).catch(() => {
            throw new HttpException('Failed to insert virtual players', ERROR_NUMBER);
        });
    }

    /**
     * Ajoute des joueurs virtuels fictifs à la collection
     */
    async resetVirtualPlayers(): Promise<void> {
        await this.deleteAllVirtualPlayers();
        await this.addDummyVirtualPlayers();
    }
}
