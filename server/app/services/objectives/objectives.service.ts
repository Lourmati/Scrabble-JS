import { Box } from '@app/classes/grid/box';
import {
    CONSONANTS_REGEX,
    HUNDRED_POINTS,
    LAST_POSITION,
    MINIMUM_TIME,
    VOWELS_BEGIN_END_REGEX,
    VOWELS_NUMBER,
    VOWELS_REGEX,
} from '@app/constants/objectives';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { Service } from 'typedi';

@Service()
export class ObjectivesService {
    constructor(private readonly placer: PlacementService) {}

    /**
     * Objectif #1 : Placer un mot contenant 4 voyelles
     *
     * @param words Liste des mots (de string) à vérifier
     * @returns Booléen s'il y a aumoins un mot contenant 4 voyelles
     */
    wordContainsFourVowels(words: string[]): boolean {
        for (const word of words) {
            const vowels = word.match(VOWELS_REGEX);
            if (vowels && vowels.length >= VOWELS_NUMBER) return true;
        }
        return false;
    }

    /**
     * Objectif #2 : Atteindre 100 points sans utiliser !échanger ou !indice
     *
     * @param points Le nombre de points actuel
     * @param commandUsed Booléen si la commande échanger ou indice a été utilisée
     * @returns Booléen si on a atteint 100 points sans utiliser échanger ou indice
     */
    hundredPointsWithoutExchangeOrHint(points: number, commandUsed: boolean): boolean {
        return points >= HUNDRED_POINTS && !commandUsed;
    }

    /**
     * Objectif #3 : Faire un placement en moins de 5 secondes
     *
     * @param time Temps de placement (en seconde)
     * @returns Booléen si le placement a été fait en moins de 5 secondes
     */
    placementLessFiveSeconds(time: number): boolean {
        return time < MINIMUM_TIME;
    }

    /**
     * Objectif #4 : Former un palindrome
     *
     * @param words Liste des mots à vérifier (s'il y a un mot palindrome)
     * @returns Booléen s'il existe aumoins 1 mot palindrome
     */
    wordIsPalindrome(words: string[]): boolean {
        for (const word of words) if (word === word.split('').reverse().join('')) return true;
        return false;
    }

    /**
     * Objectif #5 : Former un mot sans aucune consonne
     *
     * @param words Liste des mots à vérifier
     * @returns Booléen s'il existe aumoins 1 mot sans consonnes
     */
    wordContainsNoConsonants(words: string[]): boolean {
        for (const word of words) if (!word.match(CONSONANTS_REGEX)) return true;
        return false;
    }

    /**
     * Objectif #6 : Former un mot qui commence et se termine avec une voyelle
     *
     * @param words Liste des mots (de string) à vérifier
     * @returns Booléen s'il y a aumoins un mot qui commence et termine avec une voyelle
     */
    wordBeginsAndEndsWithVowel(words: string[]): boolean {
        for (const word of words) if (word.match(VOWELS_BEGIN_END_REGEX)) return true;
        return false;
    }

    /**
     * Objectif #7 : Placer une lettre à la position O15
     *
     * @param boxes La grille de jeu
     * @returns Booléen si la posiiton O15 est rempli ou non
     */
    positionO15Filled(boxes: Box[][]): boolean {
        return !this.placer.boxIsEmpty(boxes, { x: LAST_POSITION, y: LAST_POSITION });
    }

    /**
     * Objectif #8 : Former un mot qui est anagramme avec un mot déjà présent sur la grille de jeu
     *
     * @param newWords Les mots nouvellement placés (liste)
     * @param placedWords Liste de tout les mots placés depuis le début de la partie
     * @returns Booléen s'il existe aumoins 1 mot qui est un anagramme d'un mot déjà placé
     */
    wordIsAnagram(newWords: string[], placedWords: string[]): boolean {
        for (const newWord of newWords)
            for (const placedWord of placedWords) if (this.orderString(newWord) === this.orderString(placedWord)) return true;

        return false;
    }

    /**
     * Met en ordre les lettres du mot en paramètre et retourne le mot
     *
     * @param word Mot contenant les lettres qu'il faut mettre en ordre
     * @returns Le mot avec ses lettres en ordre
     */
    private orderString(word: string): string {
        return word.toLowerCase().split('').sort().join('');
    }
}
