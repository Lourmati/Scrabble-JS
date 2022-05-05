import { GameParameters } from '@app/classes/game/game-parameters';
import { PlayerInformations } from '@app/classes/player/player-informations';

export class Room {
    id: string;
    host: PlayerInformations;
    guest: PlayerInformations;
    parameters: GameParameters;

    constructor(id: string, host: PlayerInformations, parameters: GameParameters) {
        this.id = id;
        this.host = host;
        this.parameters = parameters;
    }

    /**
     * Indique si la salle est pleine
     *
     * @returns Booléen qui indique si la salle est pleine
     */
    isFull(): boolean {
        return this.guest !== undefined;
    }

    /**
     * Ajoute un joueur invité à la salle
     *
     * @param guest Information du joueur invité
     */
    addGuest(guest: PlayerInformations): void {
        this.guest = guest;
    }

    /**
     * Supprime le joueur invité de la salle
     */
    removeGuest(): void {
        this.guest = undefined as unknown as PlayerInformations;
    }
}
