import { Letter } from '@app/classes/common/letter';
import * as RESERVE from '@app/constants/reserve';

export class Reserve {
    private letters: Letter[];

    constructor() {
        this.letters = [...RESERVE.LETTERS];
    }

    /**
     * Retourne la taille de la réserve
     *
     * @returns La taille de la réserve
     */
    getSize(): number {
        return this.letters.length;
    }

    /**
     * Retourne le contenu de la réserve
     *
     * @returns Le contenu de la réserve
     */
    getContent(): Letter[] {
        return this.letters;
    }

    /**
     * Indique si la réserve est vide
     *
     * @returns Un booléen qui indique si la réserve est vide
     */
    isEmpty(): boolean {
        return this.letters.length === 0;
    }

    /**
     * Ajoute des lettres dans la réserve
     *
     * @param letters Les lettres à ajouter
     */
    addLetters(letters: Letter[]): void {
        this.letters.push(...letters);
    }

    /**
     * Retire et retourne aléatoirement un certain nombre de lettres
     *
     * @param count Le nombre de lettres à retirer
     * @returns Les lettres retirées
     */
    removeRandomLetters(count: number): Letter[] {
        const randomLetters: Letter[] = [];
        let index: number;
        for (let i = 0; i < Math.min(count, this.getSize()); i++) {
            index = Math.floor(Math.random() * this.getSize());
            randomLetters.push(this.letters[index]);
            this.letters.splice(index, 1);
        }
        return randomLetters;
    }

    /**
     * Retourne le contenu de la réserve sous le format lettre : quantité
     *
     * @returns Le contenu formatée de la réserve
     */
    getFormattedContent(): string {
        const object = Array.from(RESERVE.ALPHABET).reduce((acc: { [key: string]: number }, letter: string) => {
            acc[letter] = 0;
            return acc;
        }, {});
        return this.objectEntriesPolyfill(
            this.letters.reduce((obj, letter) => {
                obj[letter.letter] = obj[letter.letter] + 1;
                return obj;
            }, object),
        )
            .sort((lhs: [string, number], rhs: [string, number]) => {
                return lhs[0] === RESERVE.STAR ? 1 : lhs[0].charCodeAt(0) - rhs[0].charCodeAt(0);
            })
            .join(RESERVE.FORMATTED_CONTENT_DELIMITER)
            .replace(/,/g, RESERVE.FORMATTED_CONTENT_SEPARATOR);
    }

    /**
     * Polyfill sur la méthode Object.entries
     *
     * @param object L'objet dont on souhaite obtenir les entrées
     * @returns Les entrées de l'objet sous forme [clé, valeur]
     */
    private objectEntriesPolyfill(object: { [key: string]: unknown }): [string, unknown][] {
        return Object.keys(object).reduce((arr, key) => {
            arr.push([key, object[key]]);
            return arr;
        }, [] as [string, unknown][]);
    }
}
