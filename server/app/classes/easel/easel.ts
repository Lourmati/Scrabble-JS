import { Letter } from '@app/classes/common/letter';
import { EASEL_MAX_SIZE, INVALID_INDEX } from '@app/constants/easel';

export class Easel {
    private letters: Letter[];

    constructor(letters: Letter[]) {
        this.letters = letters;
    }

    /**
     * Retourne la taille du chevalet
     *
     * @returns Taille du chevalet
     */
    getSize(): number {
        return this.letters.length;
    }

    /**
     * Indique si le chevalet contient certaines lettres
     *
     * @param letters Les lettres à vérifier
     * @returns Booléen qui indique si les lettres sont incluses dans le chevalet
     */
    containsLetters(letters: Letter[]): boolean {
        return letters.every(
            (letter) =>
                this.letters.some((l) => l.letter === letter.letter) &&
                letters.filter((l) => l.letter === letter.letter).length <= this.letters.filter((l) => l.letter === letter.letter).length,
        );
    }

    /**
     * Retourne le contenu du chevalet
     *
     * @returns Contenu du chevalet
     */
    getContent(): Letter[] {
        return [...this.letters];
    }

    /**
     * Retourne le contenu du chevalet sous forme de chaîne de caractères
     *
     * @returns Contenu du chevalet
     */
    getContentAsString(): string[] {
        return this.letters.map((letter) => letter.letter);
    }

    /**
     * Indique si le chevalet est vide
     *
     * @returns Booléen qui indique si le chevalet est vide
     */
    isEmpty(): boolean {
        return this.letters.length === 0;
    }

    /**
     * Ajoute des lettres au chevalet
     *
     * @param letters Lettres à ajouter
     */
    addLetters(letters: Letter[]): void {
        if (this.letters.length + letters.length <= EASEL_MAX_SIZE) this.letters.push(...letters);
    }

    /**
     * Supprime des lettres du chevalet
     *
     * @param letters Lettres à supprimer
     */
    removeLetters(letters: Letter[]): void {
        let index: number;
        for (const letter of letters) {
            index = this.letters.findIndex((l) => l.letter === letter.letter);
            if (index !== INVALID_INDEX) this.letters.splice(index, 1);
        }
    }

    /**
     * Retourne le score du chevalet
     *
     * @returns Score du chevalet
     */
    getScore(): number {
        return this.letters.reduce((totalScore, letter) => (totalScore += letter.point), 0);
    }
}
