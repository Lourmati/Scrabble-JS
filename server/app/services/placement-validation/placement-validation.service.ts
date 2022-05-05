import { AXIS } from '@app/classes/grid/axis';
import { Box } from '@app/classes/grid/box';
import { Coordinate, Placement } from '@app/classes/grid/placement';
import { ValidationInput } from '@app/classes/grid/validation-input';
import { MIN_WORD_LENGTH } from '@app/constants/placement';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { PointsCalculatorService } from '@app/services/placement-points-calculator/points-calculator.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { Service } from 'typedi';
const FIRST_POSITION = 8;

@Service()
export class PlacementValidationService {
    // Attribut utilisé seulement pour tester les mots détectés (qualité des tests augmentée)
    wordsCopy: Box[][];

    constructor(
        private readonly placer: PlacementService,
        private readonly calculator: PointsCalculatorService,
        private readonly dictionaryService: DictionaryService,
    ) {}

    /**
     * Vérifie si un placement est valide (selon plusieurs critères) et retourne le score
     *
     * @param originalBoxes Grille de jeu
     * @param placement Placement à valider
     * @param firstPlacement Booléen s'il s'agit du premier placement de la partie
     * @returns Booléen si le placement est valide, et son score (0 si invalide)
     */
    isPlacementValid(
        gameId: string,
        originalBoxes: Box[][],
        placement: Placement,
        firstPlacement: boolean,
    ): { validity: boolean; score: number; placedWords: Box[][] } {
        const words: Box[][] = [];
        let placementData = { validity: false, score: -1, placedWords: words };

        if (firstPlacement && placement.position.x !== FIRST_POSITION && placement.position.y !== FIRST_POSITION) return placementData;

        const copyPlacement = JSON.parse(JSON.stringify(placement));
        const placeLetters = this.placer.placeLetters(JSON.parse(JSON.stringify(originalBoxes)), copyPlacement);
        if (placeLetters.lettersPlaced.length === 0) return placementData;

        if (this.validateWords(gameId, { placement, copyBoxes: placeLetters.boxes, words, lettersPlaced: placeLetters.lettersPlaced }))
            placementData = {
                validity: true,
                score: this.calculator.calculateTotalScore(originalBoxes, words, placeLetters.lettersPlaced),
                placedWords: words,
            };

        return placementData;
    }

    /**
     * Vérifie si le mot existe dans le dictionnaire
     *
     * @param word
     * @returns
     */
    checkDictionary(gameId: string, word: string): boolean {
        const dictionary = this.dictionaryService.getDictionaryByGameId(gameId);
        for (const index of dictionary.words) if (index === word) return true;
        return false;
    }

    /**
     * Vérifie la composition du mot (apostrophe & traits d'unions)
     *
     * @param word
     * @returns
     */
    checkComposition(word: string): boolean {
        return !(word.includes('-') || word.includes("'"));
    }

    /**
     * Vérifie la longueur du mot (+ 2 lettres, il faut refuser le mot)
     *
     * @param word
     * @returns
     */
    checkWordLength(word: string): boolean {
        return word.length >= MIN_WORD_LENGTH;
    }

    /**
     * Valide les mots trouvés par un placement (utilise les méthodes de validation)
     *
     * @param input Input : le placement, la grille, les mots à trouver, les lettres placées
     * @returns Booléen si des mots valides ont été trouvés
     */
    private validateWords(gameId: string, input: ValidationInput): boolean {
        const tmpWords: Box[][] = [];
        if (!(this.checkComposition(input.placement.letters) && this.checkReadabilityGrid(input))) return false;

        for (const word of input.words) {
            if (this.checkDictionary(gameId, this.placer.boxArrayToString(word))) tmpWords.push(word);
            else return false;
        }

        input.words = [...tmpWords];
        return input.words.length > 0;
    }

    /**
     * Vérifie la lisibilité d'un mot sur le grid
     *
     * @param input Input : le placement, la grille, les mots à trouver, les lettres placées
     * @returns Booléen si les mots sont lisibles et respectent les critères ou non
     */
    private checkReadabilityGrid(input: ValidationInput): boolean {
        if (
            !this.placer.isInGridBounds(input.placement.position) ||
            this.detectWords(input.placement, input.copyBoxes, input.lettersPlaced).length === 0
        )
            return false;

        input.words.push.apply(input.words, this.detectWords(input.placement, input.copyBoxes, input.lettersPlaced));
        return true;
    }

    /**
     * Détecte les mots possibles à partir d'un placement
     *
     * @param placement Placement : axe, position, lettres
     * @param copyBoxes Grille de jeu
     * @param lettersPlaced Lettres placés sur la grille
     * @returns La liste de mots possibles
     */
    private detectWords(placement: Placement, copyBoxes: Box[][], lettersPlaced: Box[]): Box[][] {
        let detectedWords: Box[][] = [];
        let initialX = placement.position.x;
        let initialY = placement.position.y;

        if (this.placer.isHorizontal(placement.axis)) initialY = this.placer.findFirstLetter(copyBoxes, placement.axis, placement.position);
        else initialX = this.placer.findFirstLetter(copyBoxes, placement.axis, placement.position);

        const coord: Coordinate = { axis: placement.axis, vec: { x: initialX, y: initialY } };
        detectedWords = this.detectMainWord(coord, detectedWords, copyBoxes);
        detectedWords.push.apply(detectedWords, this.detectOtherWords(coord, copyBoxes, lettersPlaced));
        return detectedWords;
    }

    /**
     * Détecte le mot principal formé avec le placement
     *
     * @param coord Axe et position
     * @param detectedWords Liste de mots à remplir
     * @param copyBoxes Grille de jeu
     * @returns La liste de mots trouvés
     */
    private detectMainWord(coord: Coordinate, detectedWords: Box[][], copyBoxes: Box[][]): Box[][] {
        const word: Box[] = this.placer.detectSubString(coord.axis, coord.vec, copyBoxes);
        if (this.checkWordLength(this.placer.boxArrayToString(word))) detectedWords.push(word);
        return detectedWords;
    }

    /**
     * Détecte les autres mots secondaires pouvant être formé par un meme placement
     *
     * @param coord Axe et position
     * @param copyBoxes Grille de jeu
     * @param lettersPlaced Lettres placées (trouver des mots selon ces lettres)
     * @returns La liste des autres mots trouvés
     */
    private detectOtherWords(coord: Coordinate, copyBoxes: Box[][], lettersPlaced: Box[]): Box[][] {
        let otherWords: Box[][] = [];
        let x = coord.vec.x;
        let y = coord.vec.y;

        while (this.placer.isInGridBounds({ x, y }) && !this.placer.boxIsEmpty(copyBoxes, { x, y })) {
            if (lettersPlaced.includes(copyBoxes[x][y])) {
                if (this.placer.isHorizontal(coord.axis)) {
                    const initialX = this.placer.findFirstLetter(copyBoxes, AXIS.VERTICAL, { x, y });
                    otherWords = this.detectMainWord({ axis: AXIS.VERTICAL, vec: { x: initialX, y } }, otherWords, copyBoxes);
                } else {
                    const initialY = this.placer.findFirstLetter(copyBoxes, AXIS.HORIZONTAL, { x, y });
                    otherWords = this.detectMainWord({ axis: AXIS.HORIZONTAL, vec: { x, y: initialY } }, otherWords, copyBoxes);
                }
            }
            if (this.placer.isHorizontal(coord.axis)) y++;
            else x++;
        }
        return otherWords;
    }
}
