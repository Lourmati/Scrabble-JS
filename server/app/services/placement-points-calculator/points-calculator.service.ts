import { Box } from '@app/classes/grid/box';
import { Multiplier } from '@app/classes/grid/multiplier';
import { EASEL_MAX_SIZE } from '@app/constants/easel';
import { BINGO_BONUS_POINT } from '@app/constants/placement';
import { LETTERS } from '@app/constants/reserve';
import { Service } from 'typedi';

@Service()
export class PointsCalculatorService {
    /**
     * Calcule le score total du placement (de tout les mots générés)
     *
     * @param boxes Grille de jeu
     * @param words Mots placés
     * @param lettersPlaced Lettres placées sur la grille
     * @returns Score du placement
     */
    calculateTotalScore(boxes: Box[][], words: Box[][], lettersPlaced: Box[]): number {
        let totalScore = 0;

        for (const word of words) totalScore += this.calculateWordScore(word, lettersPlaced);
        totalScore += this.getAdditionalBonus(lettersPlaced);

        this.removeBonus(lettersPlaced, boxes);
        lettersPlaced = [];
        return totalScore;
    }

    /**
     * Calculer le score total pour un mot et appliquer les bonus
     *
     * @param word Le mot dont ilf
     * @param lettersPlaced Lettres placées sur la grille
     * @returns Score du mot
     */
    private calculateWordScore(word: Box[], lettersPlaced: Box[]): number {
        let wordScore = 0;
        // Calculate total score (score of each letter + bonus)
        for (const letter of word) wordScore += this.getScoreLetter(letter, lettersPlaced);
        // Then, add word bonuses (pink & red tiles)
        for (const letter of word) if (lettersPlaced.includes(letter)) wordScore = this.getBonusWord(letter, wordScore);
        return wordScore;
    }

    /**
     * Récupérer le score de la lettre et appliquer le bonus (si case colorée)
     *
     * @param tile Case de la grille
     * @param lettersPlaced Lettres placées sur la grille
     * @returns Score de la lettre
     */
    private getScoreLetter(tile: Box, lettersPlaced: Box[]): number {
        let scoreLetter = 0;
        for (const card of LETTERS)
            if (card.letter === tile.value.toLocaleLowerCase()) {
                if (lettersPlaced.includes(tile)) scoreLetter = this.getBonusLetter(tile, card.point);
                else scoreLetter = card.point;
            }
        return scoreLetter;
    }

    /**
     * Ajoute un bonus à la lettre si elle est placée sur une case colorée
     *
     * @param tile Case de la grille
     * @param letterScore Score de la lettre
     * @returns Score de la lettre avec le bonus
     */
    private getBonusLetter(tile: Box, letterScore: number): number {
        switch (tile.multiplier) {
            case Multiplier.LetterX2:
                return (letterScore *= 2);
            case Multiplier.LetterX3:
                return (letterScore *= 3);
            default:
                return letterScore;
        }
    }

    /**
     * Ajoute le multiplicateur au mot (case colorée foncée)
     *
     * @param tile Case de la grille
     * @param wordScore Score du mot
     * @returns Score du mot avec le multiplicateur
     */
    private getBonusWord(tile: Box, wordScore: number): number {
        switch (tile.multiplier) {
            case Multiplier.WordX2:
                return (wordScore *= 2);
            case Multiplier.WordX3:
                return (wordScore *= 3);
            default:
                return wordScore;
        }
    }

    /**
     * Supprime les multiplicateurs utilisés
     *
     * @param lettersPlaced Lettres placées sur la grille
     * @param boxes Grille de jeu
     */
    private removeBonus(lettersPlaced: Box[], boxes: Box[][]): void {
        for (const letter of lettersPlaced) if (letter.multiplier !== Multiplier.Basic) boxes[letter.x][letter.y].multiplier = Multiplier.Basic;
    }

    /**
     * Calcule le score additionnel du bonus
     *
     * @param lettersPlaced Lettres placées sur la grille
     * @returns Score additionnel
     */
    private getAdditionalBonus(lettersPlaced: Box[]): number {
        if (lettersPlaced.length === EASEL_MAX_SIZE) return BINGO_BONUS_POINT;
        return 0;
    }
}
