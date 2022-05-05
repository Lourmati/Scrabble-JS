import { Box } from '@app/classes/grid/box';
import { Multiplier } from '@app/classes/grid/multiplier';
import * as GRID from '@app/constants/grid';

// The grid is already tested in client side
export class GridServer {
    boxes: Box[][];

    constructor() {
        this.boxes = [];
        this.createBoxes();
        this.setUpColors();
        this.setUpMultipliers();
    }

    /**
     * Définit les couleurs des cases
     */
    private setUpColors(): void {
        // Word X3 Multiplier
        for (const i of GRID.WORD_X3_INDEX) for (const j of GRID.WORD_X3_INDEX) this.boxes[i][j].color = GRID.MULTIPLIERS_COLORS.wordX3;
        this.boxes[8][8].color = GRID.MULTIPLIERS_COLORS.white;

        // Word X2 Multiplier
        for (const i of GRID.WORD_X2_INDEX) {
            this.boxes[i][i].color = GRID.MULTIPLIERS_COLORS.wordX2;
            this.boxes[i][GRID.ARRAY_SIZE - i].color = GRID.MULTIPLIERS_COLORS.wordX2;
        }

        // Letter X2 Multiplier
        this.boxes[4][1].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[1][4].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[12][1].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[7][3].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[9][3].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[8][4].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[7][9].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[7][7].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[9][7].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[9][9].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[3][7].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[3][9].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[4][8].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[1][12].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[4][15].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[12][15].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[13][7].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[13][9].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[12][8].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[15][4].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[15][12].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[8][12].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[7][13].color = GRID.MULTIPLIERS_COLORS.letterX2;
        this.boxes[9][13].color = GRID.MULTIPLIERS_COLORS.letterX2;

        // Letter X3 Multiplier
        this.boxes[6][2].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[6][14].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[10][6].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[10][10].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[10][2].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[10][14].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[6][6].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[6][10].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[2][6].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[2][10].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[14][6].color = GRID.MULTIPLIERS_COLORS.letterX3;
        this.boxes[14][10].color = GRID.MULTIPLIERS_COLORS.letterX3;
    }

    /**
     * Définit les multiplicateurs des cases
     */
    private setUpMultipliers(): void {
        for (let j = 1; j < GRID.ARRAY_SIZE; j++)
            for (let i = 1; i < GRID.ARRAY_SIZE; i++) this.boxes[j][i].multiplier = GRID.COLOR_TO_MULTIPLIER[this.boxes[j][i].color];
    }

    /**
     * Créé les cases
     */
    private createBoxes(): void {
        this.boxes[0] = [];
        this.boxes[0][0] = {
            x: 0,
            y: 0,
            value: '',
            index: GRID.BOX_DIMENSIONS.maxIndex,
            multiplier: Multiplier.Basic,
            color: GRID.MULTIPLIERS_COLORS.white,
            available: true,
        };

        for (let i = 1; i < GRID.ARRAY_SIZE; i++) {
            this.boxes[i] = [];
            for (let j = 1; j < GRID.ARRAY_SIZE; j++)
                this.boxes[i][j] = {
                    x: i,
                    y: j,
                    value: '',
                    index: i * j,
                    multiplier: Multiplier.Basic,
                    color: GRID.MULTIPLIERS_COLORS.white,
                    available: true,
                };
        }

        for (let i = 1; i < GRID.ARRAY_SIZE; i++) {
            this.boxes[0][i] = {
                x: 0,
                y: i,
                value: i.toString(),
                index: GRID.BOX_DIMENSIONS.boxesCount + i,
                multiplier: Multiplier.Basic,
                color: GRID.MULTIPLIERS_COLORS.white,
                available: true,
            };
            this.boxes[i][0] = {
                x: i,
                y: 0,
                value: GRID.GRID_COLUMN[i],
                index: GRID.BOX_DIMENSIONS.boxesCount + i * 2,
                multiplier: Multiplier.Basic,
                color: GRID.MULTIPLIERS_COLORS.white,
                available: true,
            };
        }
    }
}
