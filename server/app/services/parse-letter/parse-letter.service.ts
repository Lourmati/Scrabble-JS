import { Letter } from '@app/classes/common/letter';
import { LETTERS } from '@app/constants/reserve';
import { Service } from 'typedi';

@Service()
export class ParseLettersService {
    /**
     * Analyse le message et retourne la liste des lettres
     *
     * @param message Message à analyser
     * @returns Liste des lettres du message
     */
    parseLetters(message: string): Letter[] {
        return message.split('').map((letter) => ({
            letter,
            point: this.getLetterScore(letter),
        }));
    }

    /**
     * Retourne le score d'une lettre
     *
     * @param letter Lettre à analyser
     * @returns Score de la lettre
     */
    private getLetterScore(letter: string): number {
        for (const element of LETTERS) if (element.letter === letter) return element.point;
        return 0;
    }
}
