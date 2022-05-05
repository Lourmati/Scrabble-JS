import { Injectable } from '@angular/core';
import { Box } from '@app/classes/grid/box';
import { Grid } from '@app/classes/grid/grid';
import { AXIS } from '@app/classes/grid/placement';
import { Vec2 } from '@app/classes/grid/vec2';
import { ARRAY_SIZE, Multiplier, MULTIPLIERS_COLORS, YELLOW } from '@app/constants/grid';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    grid: Grid;
    selectedBox: Box | undefined;
    direction: AXIS;
    isCurrentPlayer: boolean = false;
    lockedDiretion: boolean;

    constructor(private readonly gridDrawingService: GridDrawingService) {
        this.grid = Grid.getGrid();
        this.direction = AXIS.Horizontal;
        this.lockedDiretion = false;
    }

    /**
     * Selectionne une case à partir d'une position de clique
     *
     * @param mousePos position du clique
     */
    selectBox(mousePos: Vec2): void {
        const box = this.getBoxFromPos(mousePos);
        if (this.boxIsInvalid(box)) return;

        this.gridDrawingService.clearBox(box);
        if (this.selectedBox) {
            if (this.isSelectedBox(box)) {
                this.handleCurrentSelected(this.selectedBox);
                return;
            } else this.unSelectBox();
        }
        this.setSelected(box);
    }

    /**
     * Placer une lettre sur le grid au selectedBox
     *
     * @param value La lettre a placer
     * @returns Booléen qui indique si la lettre a été placée
     */
    placeLetter(value: string): boolean {
        if (this.selectedBox) {
            const nextBox = this.getNextBox();
            if (nextBox) this.gridDrawingService.clearBox(this.grid.boxes[nextBox.x][nextBox.y]);

            this.selectedBox.value = value;
            this.selectedBox.color = YELLOW;
            this.gridDrawingService.drawBoxContent(this.selectedBox);
            this.unSelectBox();

            if (nextBox) this.setSelectedBox(nextBox);
            return true;
        }
        return false;
    }

    /**
     * Retourne vrai si la case est la selectedBox, faux sinon
     *
     * @param box Case a vérifier
     * @returns Booléen qui indique si la case est la case sélectionnée
     */
    isSelectedBox(box: Box): boolean {
        return this.selectedBox !== undefined && box.x === this.selectedBox.x && box.y === this.selectedBox.y;
    }

    /**
     * Met a jour la grid
     *
     * @param grid Nouvelle grid
     */
    updateGrid(grid: Grid): void {
        this.grid.boxes = [...grid.boxes];
        for (let j = 1; j < ARRAY_SIZE; j++) {
            for (let i = 1; i < ARRAY_SIZE; i++) {
                const temp = this.grid.boxes[i][j].x;
                this.grid.boxes[i][j].x = this.grid.boxes[i][j].y;
                this.grid.boxes[i][j].y = temp;
            }
        }
    }

    /**
     * Réinitialiser la value du selectedBox
     */
    resetSelectedBox(): void {
        if (this.selectedBox) {
            this.selectedBox.value = '';
            this.assignColor(this.selectedBox);
            this.unSelectBox();
        }
    }

    /**
     * Réinitialiser la selection
     */
    reset(): void {
        this.unSelectBox();
        this.direction = AXIS.Horizontal;
    }

    /**
     * Retourne le box en arrière
     *
     * @returns le nouveau box
     */
    getPreviousBox(): Box | undefined {
        if (this.selectedBox) {
            const x = this.selectedBox.x;
            const y = this.selectedBox.y;

            if (this.direction === AXIS.Horizontal) {
                if (x - 1 === 0) return this.selectedBox;
                return this.grid.boxes[x - 1][y];
            }
            if (y - 1 === 0) return this.selectedBox;
            return this.grid.boxes[x][y - 1];
        }
        return undefined;
    }

    /**
     * Retourne le box en avant du selectedBox
     *
     * @returns le nouveau box
     */
    getNextBox(): Box | undefined {
        if (this.selectedBox) {
            const x = this.selectedBox.x;
            const y = this.selectedBox.y;

            if (this.direction === AXIS.Horizontal) {
                if (x + 1 === ARRAY_SIZE) return undefined;
                return this.grid.boxes[this.selectedBox.x + 1][this.selectedBox.y];
            }
            if (y + 1 === ARRAY_SIZE) return undefined;
            return this.grid.boxes[this.selectedBox.x][this.selectedBox.y + 1];
        }
        return undefined;
    }

    /**
     * Définir la box sélectionnée
     *
     * @param pos position du box
     */
    setSelectedBox(pos: Vec2): void {
        this.selectedBox = this.grid.boxes[pos.x][pos.y];
        this.gridDrawingService.highlightedBorder(this.selectedBox, true);
        this.gridDrawingService.drawArrow(this.selectedBox, this.direction);
    }

    /**
     * Sélectionne une case
     *
     * @param box Case à sélectionner
     */
    setSelected(box: Box): void {
        this.selectedBox = box;
        this.gridDrawingService.highlightedBorder(this.selectedBox, true);
        this.gridDrawingService.drawArrow(this.selectedBox, this.direction);
    }

    /**
     * Désélectionne une le selectedBox
     */
    unSelectBox(): void {
        if (this.selectedBox) {
            this.gridDrawingService.highlightedBorder(this.selectedBox, false);
            this.gridDrawingService.clearBox(this.selectedBox);
            this.gridDrawingService.drawBoxContent(this.selectedBox);
        }
        this.selectedBox = undefined;
    }

    /**
     * Inverse la direction de la flèche
     */
    toggleDirection(): void {
        if (this.lockedDiretion) return;
        if (this.direction === AXIS.Horizontal) this.direction = AXIS.Vertical;
        else this.direction = AXIS.Horizontal;
    }

    /**
     * Déverrouille a direction
     */
    unlockDirection(): void {
        this.lockedDiretion = false;
    }

    /**
     * Verrouille la direction
     */
    lockDirection(): void {
        this.lockedDiretion = true;
    }

    /**
     * Retourne la case correspondante à la position de la souris
     *
     * @param mousePos Position de la souris
     * @returns La case correspondante
     */
    private getBoxFromPos(mousePos: Vec2): Box {
        const { x, y } = this.gridDrawingService.detectBoxPosition(mousePos);
        return this.grid.boxes[x][y];
    }

    /**
     * determine si le box est valide pour selection
     *
     * @param box le box à determiner
     */
    private boxIsInvalid(box: Box): boolean {
        if (!box.available) return true;
        if (!this.isCurrentPlayer || this.lockedDiretion) return true;
        if (box.value !== '') return true;
        if (this.posOutOfBounds({ x: box.x, y: box.y })) return true;
        return false;
    }

    /**
     * Gère le cas ou on click sur le meme box une deuxieme fois
     *
     * @param box le box selectionner une deuxieme fois
     */
    private handleCurrentSelected(box: Box): void {
        this.gridDrawingService.clearBox(box);
        this.toggleDirection();
        this.gridDrawingService.drawArrow(box, this.direction);
        this.gridDrawingService.highlightedBorder(box, true);
    }

    /**
     * Indique si la position est en dehors des limites
     *
     * @pos Position à tester
     */
    private posOutOfBounds(pos: Vec2): boolean {
        if (pos.x <= 0 || pos.y <= 0) {
            this.unSelectBox();
            return true;
        }
        return false;
    }

    /**
     * Assigne sa couleur à une case
     *
     * @param box Case à assigner
     */
    private assignColor(box: Box): void {
        switch (box.multiplier) {
            case Multiplier.LetterX2:
                box.color = MULTIPLIERS_COLORS.letterX2;
                break;
            case Multiplier.LetterX3:
                box.color = MULTIPLIERS_COLORS.letterX3;
                break;
            case Multiplier.WordX2:
                box.color = MULTIPLIERS_COLORS.wordX2;
                break;
            case Multiplier.WordX3:
                box.color = MULTIPLIERS_COLORS.wordX3;
                break;
            default:
                box.color = MULTIPLIERS_COLORS.white;
                break;
        }
    }
}
