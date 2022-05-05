import { Injectable } from '@angular/core';
import { Box } from '@app/classes/grid/box';
import { Grid } from '@app/classes/grid/grid';
import { AXIS } from '@app/classes/grid/placement';
import { Vec2 } from '@app/classes/grid/vec2';
import {
    ARRAY_SIZE,
    BLACK,
    CENTER,
    FONT_CONSTANTS,
    HORIZONTAL_ARROW,
    INDICATORS_FONT,
    Multiplier,
    OFFSET,
    STAR,
    STAR_DIVIDER,
    STAR_FONT,
    VERTICAL_ARROW,
    WORD_OFFSET,
    YELLOW,
} from '@app/constants/grid';

@Injectable({
    providedIn: 'root',
})
export class GridDrawingService {
    gridContext: CanvasRenderingContext2D;
    fontSize: number = FONT_CONSTANTS.defaultFontSize;
    grid: Grid;
    boxWidth: number;
    boxHeight: number;
    private canvasSize: Vec2;

    constructor() {
        this.grid = Grid.getGrid();
    }

    setSize(size: Vec2): void {
        this.canvasSize = size;
        this.boxWidth = this.canvasSize.x / ARRAY_SIZE;
        this.boxHeight = this.canvasSize.y / ARRAY_SIZE;
    }

    /**
     * Dessine la grille
     */
    drawGrid(): void {
        this.gridContext.beginPath();
        this.drawIndicators();
        this.drawRowsColumns();
        this.drawStar();
        this.gridContext.stroke();
    }

    /**
     * Clear l'intérieur du box
     *
     * @param box le box pour vider
     */
    clearBox(box: Box) {
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = box.color;
        this.gridContext.fillRect(this.boxWidth * box.x, this.boxHeight * box.y, this.boxWidth, this.boxHeight);

        this.gridContext.strokeStyle = BLACK;
        this.gridContext.rect(this.boxWidth * box.x, this.boxHeight * box.y, this.boxWidth, this.boxHeight);
        this.gridContext.stroke();
    }

    /**
     * Met a jour le fontSize
     *
     * @param value la valeur incrementer du fontSize
     */
    updateFontSize(value: number): void {
        this.fontSize = this.fontSizeOutOfBounds(value) ? this.fontSize : this.fontSize + value;
    }

    /**
     * Dessine la flèche
     *
     * @param box Dessine la flèche dans le box du grid
     * @param direction de la flèche
     */
    drawArrow(box: Box, direction: AXIS): void {
        this.gridContext.font = FONT_CONSTANTS.arrowStyle;
        this.gridContext.fillStyle = BLACK;
        this.gridContext.fillText(
            direction === AXIS.Horizontal ? HORIZONTAL_ARROW : VERTICAL_ARROW,
            box.x * this.boxHeight + ARRAY_SIZE,
            box.y * this.boxWidth + ARRAY_SIZE * 2,
        );
    }

    /**
     * Dessine la bordure du box en jaune ou noir
     *
     * @param box le box a affecter avecla bordure jaune
     * @param value true si c'est jaune, false si c'est noir
     */
    highlightedBorder(box: Box, value: boolean): void {
        this.gridContext.strokeStyle = value ? YELLOW : BLACK;
        this.gridContext.strokeRect(this.boxWidth * box.x, this.boxHeight * box.y, this.boxWidth, this.boxHeight);
    }
    /**
     * dessine le contenu de la box
     *
     * @param box boxe à dessiner
     */
    drawBoxContent(box: Box): void {
        this.clearBox(box);
        if (box.x === CENTER.x && box.y === CENTER.y && box.value === '') {
            this.drawStar();
            return;
        }
        if (box.value === '' && box.multiplier !== Multiplier.Basic) {
            this.drawMultiplier(box);
            return;
        }
        this.drawCharacter(box);
    }
    /**
     * Détecte la position de la souris
     *
     * @param pos Position de la souris
     * @return Position de la case
     */
    detectBoxPosition(pos: Vec2): Vec2 {
        const x = Math.ceil(pos.x / this.boxWidth) - 1;
        const y = Math.ceil(pos.y / this.boxHeight) - 1;
        return { x: y, y: x };
    }
    /**
     * Dessine le charactere de la boxe
     *
     * @param box la box correspondante
     */
    private drawCharacter(box: Box): void {
        this.gridContext.font = `${this.fontSize}px system-ui`;
        this.gridContext.fillStyle = BLACK;
        this.gridContext.fillText(box.value.toUpperCase(), box.x * this.boxWidth + ARRAY_SIZE, box.y * this.boxHeight + OFFSET);
    }
    /**
     * Dessine le multiplier de la case
     *
     * @param box la boxe correspondante
     */
    private drawMultiplier(box: Box): void {
        this.gridContext.font = FONT_CONSTANTS.defaultMultiplierFont;
        this.gridContext.fillStyle = BLACK;
        this.gridContext.fillText(
            box.multiplier,
            box.x * this.boxWidth + WORD_OFFSET,
            box.y * this.boxHeight + OFFSET,
            this.boxWidth - WORD_OFFSET * 2,
        );
    }

    /**
     * Indique si la police dépasse des bordures
     *
     * @param value Taille de la police
     * @returns Booléen qui indique si la police dépasse des bordures
     */

    private fontSizeOutOfBounds(value: number): boolean {
        return this.fontSize + value < FONT_CONSTANTS.minFontSize || this.fontSize + value > FONT_CONSTANTS.maxFontSize;
    }

    /**
     * Dessine les indicteurs (lettres et chiffres autour de la grid)
     */
    private drawIndicators(): void {
        this.gridContext.strokeStyle = BLACK;
        this.gridContext.font = INDICATORS_FONT;
        for (let i = 1; i < ARRAY_SIZE; i++) {
            this.gridContext.fillText(this.grid.boxes[0][i].value, i * this.boxWidth + ARRAY_SIZE, OFFSET);
            this.gridContext.fillText(this.grid.boxes[i][0].value, ARRAY_SIZE, i * this.boxHeight + OFFSET);
        }
    }

    /**
     * Dessine le contenu de la grille
     */
    private drawRowsColumns(): void {
        this.gridContext.lineWidth = 1;
        for (let j = 1; j < ARRAY_SIZE; j++) for (let i = 1; i < ARRAY_SIZE; i++) this.drawBoxContent(this.grid.boxes[i][j]);
    }

    /**
     * Dessine l'étoile
     */
    private drawStar(): void {
        if (this.grid.boxes[CENTER.x][CENTER.y].value === '') {
            this.gridContext.font = STAR_FONT;
            this.gridContext.fillText(STAR, CENTER.x * this.boxWidth, (CENTER.y + 1) * this.boxHeight - ARRAY_SIZE / STAR_DIVIDER);
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    set width(x: number) {
        this.canvasSize.x = x;
    }

    set height(y: number) {
        this.canvasSize.y = y;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
