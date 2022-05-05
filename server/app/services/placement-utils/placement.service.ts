import { AXIS } from '@app/classes/grid/axis';
import { Box } from '@app/classes/grid/box';
import { Placement, Vec2 } from '@app/classes/grid/placement';
import { ARRAY_SIZE } from '@app/constants/grid';
import { NORMALIZE_MODE, REMOVE_SYMBOLS_REGEX } from '@app/constants/placement';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { Service } from 'typedi';

@Service()
export class PlacementService {
    constructor(private readonly dictionaryService: DictionaryService) {}

    /**
     * Filtre les symboles (cédilles, accents, etc.) pour rendre le mot conforme au Scrabble
     *
     * @param word Le mot à filtrer
     * @returns Le mot filtré
     */
    processSymbols(word: string): string {
        return word.normalize(NORMALIZE_MODE).replace(REMOVE_SYMBOLS_REGEX, '');
    }

    /**
     * Vérifier si la position est dans les bornes de la grid
     *
     * @param vec Vecteur de la position à vérifier
     * @returns Booléen indiquant si la position ne dépasse pas les bornes
     */
    isInGridBounds(vec: Vec2): boolean {
        return 0 < vec.y && vec.y < ARRAY_SIZE && 0 < vec.x && vec.x < ARRAY_SIZE;
    }

    /**
     * Vérifie si une tuile est vide
     *
     * @param boxes La grille à vérifier
     * @param vec La position à vérifier dans la grille
     * @returns Booléen indiquant si la tuile est vide ou non
     */
    boxIsEmpty(boxes: Box[][], vec: Vec2): boolean {
        return boxes[vec.x][vec.y].value === '' || boxes[vec.x][vec.y].value === '★';
    }

    /**
     * Indique si l'axe est horizontale
     *
     * @param axis Axe à vérifier
     * @returns Booléen qui indique si l'axe est horizontale
     */
    isHorizontal(axis: AXIS): boolean {
        return axis === AXIS.HORIZONTAL;
    }

    /**
     * Transforme une liste de Box en un string
     *
     * @param words La liste de Box (object Box)
     * @returns Le string
     */
    boxArrayToString(words: Box[]): string {
        return words.map((box) => box.value).join('');
    }

    /**
     * Transforme une liste 2D de Box en une liste string
     *
     * @param words La liste de Box (object Box)
     * @returns La liste de string
     */
    boxArrayToStringArray(placedWords: Box[][]): string[] {
        const placedString: string[] = [];
        for (const word of placedWords) {
            placedString.push(this.boxArrayToString(word));
        }

        return placedString;
    }

    /**
     * Place les lettres sur la grille en paramètre
     *
     * @param boxes La grille
     * @param placement Le placement (lettres, axe et position)
     * @returns La grille avec les lettres placés ainsi qu'une liste des lettres placés
     */
    placeLetters(boxes: Box[][], placement: Placement): { boxes: Box[][]; lettersPlaced: Box[] } {
        const letters = this.processSymbols(placement.letters);
        const lettersPlaced: Box[] = [];
        const vec = placement.position;
        for (let i = 0; i < letters.length; i++)
            while (this.isInGridBounds(vec)) {
                if (this.boxIsEmpty(boxes, vec)) {
                    boxes[vec.x][vec.y].value = letters.charAt(i);
                    boxes[vec.x][vec.y].available = false;
                    lettersPlaced.push(boxes[vec.x][vec.y]);
                    break;
                } else if (i === 0) return { boxes, lettersPlaced };
                if (this.isHorizontal(placement.axis)) vec.y++;
                else vec.x++;
            }
        return { boxes, lettersPlaced };
    }

    /**
     * Détecte un sous string dans la grille à partir de la première lettre donnée en paramètre
     *
     * @param axis
     * @param vec
     * @param boxes
     * @returns Le sous string détecté
     */
    detectSubString(axis: AXIS, vec: Vec2, boxes: Box[][]): Box[] {
        const word: Box[] = [];
        let x = vec.x;
        let y = vec.y;

        while (this.isInGridBounds({ x, y }) && !this.boxIsEmpty(boxes, { x, y })) {
            word.push(boxes[x][y]);
            if (this.isHorizontal(axis)) y++;
            else x++;
        }

        return word;
    }

    /**
     * Itère jusqu'à ce qu'il trouve la première lettre d'un mot (tuile non-vide) à partir d'une position donnée
     *
     * @param boxes La grille dans laquelle il faut trouver la première position
     * @param axis L'axe de la position
     * @param vec Les coordonnées de la position
     * @returns Retourne la première position ou la tuile est non-vide
     */
    findFirstLetter(boxes: Box[][], axis: AXIS, vec: Vec2): number {
        let x = vec.x;
        let y = vec.y;

        if (this.isHorizontal(axis)) {
            while (y - 1 > 0 && !this.boxIsEmpty(boxes, { x, y: y - 1 })) y--;
            return y;
        }

        while (x - 1 > 0 && !this.boxIsEmpty(boxes, { x: x - 1, y })) x--;
        return x;
    }

    /**
     * Vérifie si le chevalet contient les lettres nécessaires selon les lettres manquantes (pour former un mot)
     *
     * @param missingLetters Lettres manquantes
     * @param easelLetters Lettres du chevalet
     * @returns Booléen si le chevalet contient ou non les lettres voulues
     */
    easelHasLetters(missingLetters: string[], easelLetters: string[]): boolean {
        const easel: string[] = [...easelLetters];
        if (missingLetters.length > easelLetters.length) return false;
        for (const letter of missingLetters)
            if (easel.includes(letter))
                easel.splice(
                    easel.findIndex((l) => l === letter),
                    1,
                );
            else return false;
        return true;
    }

    /**
     * Trouve les lettres manquantes pour un certain mot en enlevant un sous-string
     *
     * @param word Représente le mot voulu
     * @param subString Représente les lettres déjà présente
     * @returns Les lettres manquantes pour former le mot voulu
     */
    findMissingLetters(word: string, subString: string): string[] {
        return word.replace(subString, '').split('');
    }

    /**
     * Trouver les mots possibles du dictionnaire (pour chaque mot, on vérifie s'il contient le sous-string en paramètre)
     *
     * @param word Le sous-string qu'il faut vérifier pour chaque mot du dictionnaire
     * @returns Liste de tout les mots possibles que l'on pourrait former
     */
    findPossibleWords(gameId: string, word: Box[]): string[] {
        const words: string[] = [];
        const dictionary = this.dictionaryService.getDictionaryByGameId(gameId);
        for (const index of dictionary.words) if (index.includes(this.boxArrayToString(word).toLocaleLowerCase())) words.push(index);
        return words;
    }

    /**
     * Retourne une copie profonde de la grille
     *
     * @param boxes Grille à copier
     * @returns Copie profonde de la grille
     */
    getGridCopy(boxes: Box[][]): Box[][] {
        return boxes.map((row) => row.map((box) => ({ ...box })));
    }
}
