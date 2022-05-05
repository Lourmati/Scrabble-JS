import { Letter } from '@app/classes/common/letter';
import { Easel } from '@app/classes/easel/easel';

export class Player {
    passedTurn: number;
    usedExchange: boolean;
    usedHints: boolean;
    protected name: string;
    protected id: string;
    protected easel: Easel;
    protected score: number;

    constructor(name: string, id: string, letters: Letter[]) {
        this.name = name;
        this.id = id;
        this.easel = new Easel(letters);
        this.score = 0;
        this.passedTurn = 0;
        this.usedExchange = false;
        this.usedHints = false;
    }

    /**
     * Retourne l'identifiant du joueur
     *
     * @returns Identifiant du joueur
     */
    getId(): string {
        return this.id;
    }

    /**
     * Retourne le nom du joueur
     *
     * @returns Nom du joueur
     */
    getName(): string {
        return this.name;
    }

    /**
     * Retourne le chevalet du joueur
     *
     * @returns Chevalet du joueur
     */
    getEasel(): Easel {
        return this.easel;
    }

    /**
     * Indique si le joueur a ces lettres dans son chevalet
     *
     * @param letters Lettres à vérifier
     * @returns Booléen qui indique si le joueur possède ces lettres
     */
    haveLetters(letters: Letter[]): boolean {
        return this.easel.containsLetters(letters);
    }

    /**
     * Augmente le score du joueur
     *
     * @param score Score à ajouter
     */
    addScore(score: number): void {
        if (score >= 0) this.score += score;
    }

    /**
     * Ajoute le score du chevalet du joueur
     */
    addScoreFromEasel(): void {
        for (const letter of this.easel.getContent()) this.addScore(letter.point);
    }

    /**
     * Ajoute le score d'un ensemble de lettres
     *
     * @param letters Lettres dont on doit ajouter le score
     */
    addScoreFromOtherEasel(letters: Letter[]): void {
        for (const letter of letters) this.addScore(letter.point);
    }

    /**
     * Diminue le score du joueur
     *
     * @param score Score à retirer
     */
    removeScore(score: number): void {
        if (score >= 0) this.score -= score;
    }

    /**
     * Retourne le score du joueur
     *
     * @returns Score du joueur
     */
    getScore(): number {
        return this.score;
    }
}
