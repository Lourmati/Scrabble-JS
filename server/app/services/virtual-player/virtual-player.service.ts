import { Message } from '@app/classes/chatbox/message';
import { Game } from '@app/classes/game/game';
import { Placement } from '@app/classes/grid/placement';
import { PlacementRequest } from '@app/classes/placement/placement-request';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { VirtualPlayerNames } from '@app/classes/virtual-player/virtual-player-names';
import { ID, MAX_THRESHOLD_MS, MIN_NAMES_COUNT, MIN_THRESHOLD_MS } from '@app/constants/virtual-player';
import { VirtualPlayerNamesService } from '@app/database/virtual-player/virtual-player-names.service';
import { PlacementGeneratorService } from '@app/services/placement-generator/placement-generator.service';
import { Service } from 'typedi';

@Service()
export class VirtualPlayerService {
    constructor(
        private readonly placementGenerationService: PlacementGeneratorService,
        private readonly virtualPlayerNamesService: VirtualPlayerNamesService,
    ) {}

    /**
     * Génère des placements pour le joueur virtuel
     *
     * @param gameId Identifiant de la partie
     * @param request Requête de placements
     * @returns Promesse contenant les placements
     */
    async generatePlacements(gameId: string, request: PlacementRequest): Promise<Placement[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.placementGenerationService.generatePlacements(gameId, request));
            }, MIN_THRESHOLD_MS);
        });
    }

    /**
     * Retourne des placements avec un délai entre 3s et 20s. Au delà de 20s,
     * on retourne une liste vide
     *
     * @param gameId Identifiant de la partie
     * @param request Requête de placements
     * @returns Promesse contenant les placements
     */
    async getPlacements(gameId: string, request: PlacementRequest): Promise<Placement[]> {
        return new Promise((resolve) => {
            let expired = false;
            setTimeout(() => {
                if (!expired) resolve([]);
            }, MAX_THRESHOLD_MS);
            this.generatePlacements(gameId, request).then((placements) => {
                expired = true;
                resolve(placements);
            });
        });
    }

    /**
     * Créer un message à envoyer de la part du joueur virtuel
     *
     * @param game Partie de jeu
     * @param content Contenu du message
     * @returns Message à envoyer
     */
    createMessage(game: Game, content: string): Message {
        return { gameId: game.id, playerId: ID, playerName: game.otherPlayer.getName(), content };
    }

    /**
     * Retourne les noms possibles des joueurs virtuels
     *
     * @returns Promesse contenant les noms des joueurs virtuels
     */
    async getVirtualPlayerNames(): Promise<VirtualPlayerNames> {
        const names = this.virtualPlayerNamesService.getVirtualPlayer();
        const data: VirtualPlayerNames = { beginner: [], expert: [] };
        (await names).forEach((name) => {
            if (name.level === VirtualPlayerLevel.BEGINNER) data.beginner.push(name.name);
            else data.expert.push(name.name);
        });
        return data;
    }

    /**
     * Génère aléatoirement un nom pour le joueur virtuel
     *
     * @param otherPlayerName Nom de l'autre joueur
     * @param level Niveau du joueur virtuel
     * @returns Nom du joueur virtuel
     */
    async getRandomName(otherPlayerName: string, level: VirtualPlayerLevel): Promise<string> {
        const names = (await this.virtualPlayerNamesService.getVirtualPlayer()).filter((name) => name.level === level);
        let virtualPlayerName: string;
        do virtualPlayerName = names[Math.floor(Math.random() * names.length)].name;
        while (virtualPlayerName === otherPlayerName);
        return virtualPlayerName;
    }

    /**
     * Indique si la liste de noms des joueurs virtuels est valide
     *
     * @param names Liste de noms
     * @returns Booléen qui indique si la liste est valide
     */
    isValidNames(names: string[]): boolean {
        return names.length >= MIN_NAMES_COUNT;
    }

    /**
     * Indique si un index est valide dans la liste de noms des joueurs virtuels
     *
     * @param names Liste de noms
     * @param index Index dans la liste
     * @returns Booléen qui indique si l'index est valide
     */
    isValidNamesIndex(names: string[], index: number) {
        return index >= MIN_NAMES_COUNT && index < names.length;
    }

    /**
     * Ajouter un nom à la liste de noms des joueurs virtuels
     *
     * @param name Nom à ajouter
     * @param level Niveau du joueur virtuel
     * @returns Booléen qui indique si le nom a été ajouté
     */
    async addName(name: string, level: VirtualPlayerLevel): Promise<boolean> {
        const data = await this.getVirtualPlayerNames();
        const names = level === VirtualPlayerLevel.BEGINNER ? data.beginner : data.expert;
        const otherNames = level === VirtualPlayerLevel.BEGINNER ? data.expert : data.beginner;
        if (!this.isValidNames(names) || names.includes(name) || otherNames.includes(name)) return false;
        names.push(name);
        await this.virtualPlayerNamesService.addVirtualPlayer({ name, level });
        return true;
    }

    /**
     * Modifie un nom de la liste de noms des joueurs virtuels
     *
     * @param index Index du nom à modifier
     * @param newName Nouveau nom
     * @param level Niveau du joueur virtuel
     * @returns Booléen qui indique si le nom a été modifié
     */
    async editName(index: number, newName: string, level: VirtualPlayerLevel): Promise<boolean> {
        const data = await this.getVirtualPlayerNames();
        const names = level === VirtualPlayerLevel.BEGINNER ? data.beginner : data.expert;
        const otherNames = level === VirtualPlayerLevel.BEGINNER ? data.expert : data.beginner;
        if (!this.isValidNames(names) || !this.isValidNamesIndex(names, index) || otherNames.includes(newName)) return false;
        const oldName = names[index];
        names[index] = newName;
        await this.virtualPlayerNamesService.updateVirtualPlayerByName(oldName, newName);
        return true;
    }

    /**
     * Supprime un nom de la liste de noms des joueurs virtuels
     *
     * @param index Index du nom à supprimé
     * @param level Niveau du joueur virtuel
     * @returns Booléen qui indique si le nom a été supprimé
     */
    async deleteName(index: number, level: VirtualPlayerLevel): Promise<boolean> {
        const data = await this.getVirtualPlayerNames();
        const names = level === VirtualPlayerLevel.BEGINNER ? data.beginner : data.expert;
        if (!this.isValidNames(names) || !this.isValidNamesIndex(names, index)) return false;
        await this.virtualPlayerNamesService.deleteVirtualPlayer({ name: names[index], level });
        return true;
    }

    /**
     * Réinitialise les 2 listes de noms des joueurs virtuels
     *
     * @returns Booléen qui indique si les 2 listes ont été réinitialisées
     */
    async resetNames(): Promise<boolean> {
        await this.virtualPlayerNamesService.resetVirtualPlayers();
        return true;
    }
}
