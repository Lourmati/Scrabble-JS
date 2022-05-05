import { AXIS } from '@app/classes/grid/axis';
import { Box } from '@app/classes/grid/box';
import { GenerationInput } from '@app/classes/grid/generation-input';
import { Coordinate, Placement, Vec2 } from '@app/classes/grid/placement';
import { PlacementRequest } from '@app/classes/placement/placement-request';
import { ScoreConstraint } from '@app/classes/virtual-player/score-constraints';
import { ARRAY_SIZE } from '@app/constants/grid';
import { HINTS_PLACEMENT_COUNT, MIDDLE_POSITION, SORT_CONSTANT } from '@app/constants/placement';
import { MAX_SCORE } from '@app/constants/virtual-player';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { PlacementService } from '@app/services/placement-utils/placement.service';
import { PlacementValidationService } from '@app/services/placement-validation/placement-validation.service';
import { Service } from 'typedi';

@Service()
export class PlacementGeneratorService {
    constructor(
        private readonly placer: PlacementService,
        private readonly validator: PlacementValidationService,
        private readonly dictionaryService: DictionaryService,
    ) {}

    /**
     * Génère tout les placements possibles selon la contrainte (commande indice ou placement du joueur virtuel)
     *
     * @param request La requête contenant les lettres du chevalet, la grille, un boolean (premier placement ou non) et la contrainte
     * @returns Une liste de placements possibles
     */
    generatePlacements(gameId: string, request: PlacementRequest): Placement[] {
        let possiblePlacements: Placement[] = [];
        const restrictedPositions: Vec2[] = [];

        if (request.isGridEmpty) possiblePlacements = this.findFirstPlacements(gameId, request.easel);
        else possiblePlacements = this.browseGridForPlacements(gameId, request.grid, request.easel, restrictedPositions);
        possiblePlacements = this.filterAndShufflePlacements(possiblePlacements, restrictedPositions);

        if (request.constraints?.maxScore === MAX_SCORE) return this.getPlacementMaxScore(gameId, request.grid, possiblePlacements);
        if (request.constraints) return this.applyConstraints(gameId, request.grid, request.constraints, possiblePlacements);
        return this.getCluePlacements(gameId, request.grid, possiblePlacements);
    }

    /**
     * Trouve le meilleur placement possible (avec score le meilleur score)
     *
     * @param boxes Il s'agit de la grille de jeu
     * @param possiblePlacements La liste de tout les placements possibles (dont on choisit le meilleur)
     * @returns Le meilleur placement
     */
    getPlacementMaxScore(gameId: string, boxes: Box[][], possiblePlacements: Placement[]): Placement[] {
        let placements: Placement[] = [];
        let maxScore = 0;
        for (const p of possiblePlacements) {
            const placementData = this.validator.isPlacementValid(gameId, this.placer.getGridCopy(boxes), p, false);
            if (placementData.score > maxScore) {
                placements = [p];
                maxScore = placementData.score;
            }
        }

        return placements;
    }

    /**
     * Trouve tout les premiers placements possibles (grille vide, position du centre) que l'on peut former avec les lettres du chevalet
     *
     * @param easelLetters Les lettres du chevalet
     * @returns Tout les placements possibles
     */
    private findFirstPlacements(gameId: string, easelLetters: string[]): Placement[] {
        const possiblePlacements: Placement[] = [];
        const dictionary = this.dictionaryService.getDictionaryByGameId(gameId);
        for (const word of dictionary.words)
            if (word.length + MIDDLE_POSITION < ARRAY_SIZE && this.placer.easelHasLetters(word.split(''), easelLetters)) {
                possiblePlacements.push({ position: { x: MIDDLE_POSITION, y: MIDDLE_POSITION }, letters: word, axis: AXIS.HORIZONTAL });
                possiblePlacements.push({ position: { x: MIDDLE_POSITION, y: MIDDLE_POSITION }, letters: word, axis: AXIS.VERTICAL });
            }
        return possiblePlacements;
    }

    /**
     * Applique les contraintes du joueur virtuel (génération d'un placement entre le score minimum et score maximum voulus)
     *
     * @param boxes La grille de jeu
     * @param constraints Les contraintes (score min et score max)
     * @param possiblePlacements Liste de tout les placements possibles que l'on a déjà trouvé
     * @returns Une liste de 1 placement destiné au joueur virtuel et qui respecte les contraintes données
     */
    private applyConstraints(gameId: string, boxes: Box[][], constraints: ScoreConstraint, possiblePlacements: Placement[]): Placement[] {
        let placements: Placement[] = [];
        for (const p of possiblePlacements) {
            const placementData = this.validator.isPlacementValid(gameId, this.placer.getGridCopy(boxes), p, false);
            if (placementData.validity && constraints.minScore <= placementData.score && placementData.score <= constraints.maxScore)
                placements = [p];
        }
        return placements;
    }

    /**
     * Itère la liste de placements possibles jusqu'à ce qu'il trouve 3 placements conformes pour la commande indice
     *
     * @param boxes La grille qu'il faut passer en paramètre pour vérifier la validité des 3 placements choisis
     * @param possiblePlacements La liste de tout les placements possibles
     * @returns
     */
    private getCluePlacements(gameId: string, boxes: Box[][], possiblePlacements: Placement[]): Placement[] {
        const placements: Placement[] = [];
        for (const p of possiblePlacements)
            if (
                placements.length < HINTS_PLACEMENT_COUNT &&
                this.validator.isPlacementValid(gameId, this.placer.getGridCopy(boxes), p, false).validity
            )
                placements.push(p);
        return placements;
    }

    /**
     * Filtre les placements pour qu'ils respectent les positions conformes et mélange la liste de placements pour varier les placements
     *
     * @param possiblePlacements La liste de tout les placements possibles
     * @param restrictedPositions La liste des positions interdites pour les placements générés
     * @returns Les placements filtrés et mélangés
     */
    private filterAndShufflePlacements(possiblePlacements: Placement[], restrictedPositions: Vec2[]): Placement[] {
        possiblePlacements = possiblePlacements.filter(
            (p) => !restrictedPositions.some((r) => (r.x === p.position.x && r.y === p.position.y) || p.letters === ''),
        );
        possiblePlacements = possiblePlacements.sort(() => SORT_CONSTANT - Math.random());
        return possiblePlacements;
    }

    /**
     * Parcours toute la grille, et trouve tout les placements possibles à partir d'une tuile non-vide
     *
     * @param boxes La grille
     * @param easelLetters Les lettres du chevalet
     * @param restrictedPositions La liste des positions interdites à remplir au fur et à mesure que les placements sont trouvé
     * @returns La liste de tout les placements possibles
     */
    private browseGridForPlacements(gameId: string, boxes: Box[][], easelLetters: string[], restrictedPositions: Vec2[]): Placement[] {
        const possiblePlacements: Placement[] = [];
        for (let i = 1; i < ARRAY_SIZE; i++) {
            for (let j = 1; j < ARRAY_SIZE; j++) {
                if (!this.placer.boxIsEmpty(boxes, { x: i, y: j })) {
                    restrictedPositions.push({ x: i, y: j });
                    this.generatePlacementTile(gameId, { x: i, y: j }, { easelLetters, possiblePlacements, boxes });
                }
            }
        }
        return possiblePlacements;
    }

    /**
     * Génère un placement à partir d'une tuile non-vide (donnée avec la position)
     *
     * @param vec Vecteur correspondant à la position de la tuile
     * @param input Input contenant la grille, les lettres du chevalet et les placements possibles
     */
    private generatePlacementTile(gameId: string, vec: Vec2, input: GenerationInput): void {
        const initialY = this.placer.findFirstLetter(input.boxes, AXIS.HORIZONTAL, { x: vec.x, y: vec.y });
        this.findPlacementForSubString(gameId, { axis: AXIS.HORIZONTAL, vec: { x: vec.x, y: initialY } }, input);

        const initialX = this.placer.findFirstLetter(input.boxes, AXIS.VERTICAL, { x: vec.x, y: vec.y });
        this.findPlacementForSubString(gameId, { axis: AXIS.VERTICAL, vec: { x: initialX, y: vec.y } }, input);
    }

    /**
     * Trouve un placement spécifique à un substring (lettres présentes sur la grille)
     *
     * @param coord Coordonnées du substring
     * @param input Input contenant la grille, les lettres du chevalet et les placements possibles
     */
    private findPlacementForSubString(gameId: string, coord: Coordinate, input: GenerationInput) {
        const subString = this.placer.detectSubString(coord.axis, { x: coord.vec.x, y: coord.vec.y }, input.boxes);
        for (const word of this.placer.findPossibleWords(gameId, subString)) {
            const missingLetters = this.placer.findMissingLetters(word, this.placer.boxArrayToString(subString));
            if (this.placer.easelHasLetters(missingLetters, input.easelLetters)) {
                const pos: Vec2 = this.getPlacementPosition({ axis: coord.axis, vec: coord.vec }, word, this.placer.boxArrayToString(subString));
                const placement = this.adjustPlacement(input.boxes, { position: pos, letters: missingLetters.join(''), axis: coord.axis });
                input.possiblePlacements.push(placement);
            }
        }
    }

    /**
     * Ajuste un placement lorsque ses lettres sont déjà présentes sur la grille (il faut les enlever du placement)
     *
     * @param boxes La grille
     * @param placement Le placement
     * @returns Le placement ajusté
     */
    private adjustPlacement(boxes: Box[][], placement: Placement): Placement {
        const vec = JSON.parse(JSON.stringify(placement.position));
        const lettersPlacement = placement.letters.split('');
        for (let i = 0; i < lettersPlacement.length; i++)
            while (this.placer.isInGridBounds(vec)) {
                if (this.placer.boxIsEmpty(boxes, vec)) break;
                else if (boxes[vec.x][vec.y].value === lettersPlacement[i]) {
                    lettersPlacement[i] = '';
                    break;
                }
                if (this.placer.isHorizontal(placement.axis)) vec.y++;
                else vec.x++;
            }
        placement.letters = lettersPlacement.join('');
        return placement;
    }

    /**
     * Retourne la position du placement selon l'index du substring dans le mot
     *
     * @param coord Coordonnée (position et axe)
     * @param word Mot qui serait complété avec le substring
     * @param subString Correspond aux lettres présentes sur la grille
     * @returns La bonne position du placement
     */
    private getPlacementPosition(coord: Coordinate, word: string, subString: string): Vec2 {
        const vec: Vec2 = JSON.parse(JSON.stringify(coord.vec));
        const index = word.indexOf(subString);
        if (this.placer.isHorizontal(coord.axis)) {
            if (index === 0) vec.y += subString.length;
            if (index > 0) vec.y -= index;
        } else {
            if (index === 0) vec.x += subString.length;
            if (index > 0) vec.x -= index;
        }
        if (this.placer.isInGridBounds(vec)) return vec;
        return coord.vec;
    }
}
