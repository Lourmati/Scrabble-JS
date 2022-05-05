import { Letter } from '@app/classes/common/letter';
import { Exchange } from '@app/classes/game/exchange';
import { Player } from '@app/classes/player/player';
import { VirtualPlayerLevel } from '@app/classes/virtual-player//virtual-player-level';
import { ScoreConstraint } from '@app/classes/virtual-player/score-constraints';
import { VirtualPlayerCommand } from '@app/classes/virtual-player/virtual-player-commands';
import { EASEL_MAX_SIZE } from '@app/constants/easel';
import { COMMAND_PROBABILITY_MAP, Option, SCORE_CONSTRAINT_PROBABILITY_MAP } from '@app/constants/probalities';
import { ID, MAX_SCORE } from '@app/constants/virtual-player';

export class VirtualPlayer extends Player {
    level: VirtualPlayerLevel;

    constructor(name: string, letters: Letter[], level: VirtualPlayerLevel) {
        super(ID, '', letters);
        this.level = level;
        this.name = name;
    }

    /**
     * Choisit aléatoirement une option
     *
     * @param options Liste d'options
     * @returns Option choisie aléatoirement
     */
    getRandomElement<T>(options: Option<T>[]): T {
        const random: number = Math.random();
        let threshold = 0;
        for (const option of options) {
            threshold += option.probability;
            if (random < threshold) return option.element;
        }
        return options[0].element;
    }

    /**
     * Choisit aléatoirement une commande à exécuter
     *
     * @returns Commande à exécuter
     */
    getCommand(): VirtualPlayerCommand {
        if (this.level === VirtualPlayerLevel.BEGINNER) return this.getRandomElement(COMMAND_PROBABILITY_MAP);
        else return VirtualPlayerCommand.PLACE;
    }

    /**
     * Choisit aléatoirement des contraintes de score
     *
     * @returns Contraintes de score
     */
    getScoreConstraint(): ScoreConstraint {
        if (this.level === VirtualPlayerLevel.BEGINNER) return this.getRandomElement(SCORE_CONSTRAINT_PROBABILITY_MAP);
        else return { minScore: 0, maxScore: MAX_SCORE };
    }

    /**
     * Retourne un échange de lettres aléatoire
     *
     * @returns Échange à effectuer
     */
    getExchange(level: VirtualPlayerLevel, reserveSize: number): Exchange {
        const easel = this.easel.getContent();
        const letters: Letter[] = [];
        const count = level === VirtualPlayerLevel.BEGINNER ? this.getRandomEaselIndex(true) : Math.min(reserveSize, EASEL_MAX_SIZE);
        for (let i = 0; i < count; i++) letters.push(easel[this.getRandomEaselIndex(false)]);
        return { letters };
    }

    /**
     * Retourne un indice aléatoire du chevalet
     *
     * @param aboveZero Indique si l'index doit être supérieur à 0
     * @returns Indice aléatoire du chevalet
     */
    private getRandomEaselIndex(aboveZero: boolean): number {
        const random = Math.floor(Math.random() * this.easel.getSize());
        return aboveZero && random === 0 ? random + 1 : random;
    }
}
