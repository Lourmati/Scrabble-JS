import { ARRAY_SIZE, BOX_DIMENSIONS, GRID_COLUMN, Multiplier, MULTIPLIERS_COLORS } from '@app/constants/grid';
import { Box } from './box';

const { white, wordX2, wordX3, letterX2, letterX3 } = MULTIPLIERS_COLORS;
const { boxesCount, maxIndex } = BOX_DIMENSIONS;

export class Grid {
    private static grid: Grid;
    boxes: Box[][] = [];

    private constructor() {
        this.createBoxes();
        this.setUpColors();
        this.setUpMultipliers();
    }

    static getGrid() {
        if (!this.grid) {
            this.grid = new Grid();
        }
        return this.grid;
    }

    private setUpColors(): void {
        // Word X3 Multiplier
        this.boxes[1][1].color = wordX3;
        this.boxes[1][8].color = wordX3;
        this.boxes[1][15].color = wordX3;
        this.boxes[8][1].color = wordX3;
        this.boxes[15][1].color = wordX3;
        this.boxes[15][8].color = wordX3;
        this.boxes[15][15].color = wordX3;
        this.boxes[8][15].color = wordX3;

        // Word X2 Multiplier
        this.boxes[2][2].color = wordX2;
        this.boxes[3][3].color = wordX2;
        this.boxes[4][4].color = wordX2;
        this.boxes[5][5].color = wordX2;
        this.boxes[5][11].color = wordX2;
        this.boxes[4][12].color = wordX2;
        this.boxes[3][13].color = wordX2;
        this.boxes[2][14].color = wordX2;
        this.boxes[11][5].color = wordX2;
        this.boxes[12][4].color = wordX2;
        this.boxes[13][3].color = wordX2;
        this.boxes[14][2].color = wordX2;
        this.boxes[11][11].color = wordX2;
        this.boxes[12][12].color = wordX2;
        this.boxes[13][13].color = wordX2;
        this.boxes[14][14].color = wordX2;

        // Letter X2 Multiplier
        this.boxes[4][1].color = letterX2;
        this.boxes[1][4].color = letterX2;
        this.boxes[12][1].color = letterX2;
        this.boxes[7][3].color = letterX2;
        this.boxes[9][3].color = letterX2;
        this.boxes[8][4].color = letterX2;
        this.boxes[7][9].color = letterX2;
        this.boxes[7][7].color = letterX2;
        this.boxes[9][7].color = letterX2;
        this.boxes[9][9].color = letterX2;
        this.boxes[3][7].color = letterX2;
        this.boxes[3][9].color = letterX2;
        this.boxes[4][8].color = letterX2;
        this.boxes[1][12].color = letterX2;
        this.boxes[4][15].color = letterX2;
        this.boxes[12][15].color = letterX2;
        this.boxes[13][7].color = letterX2;
        this.boxes[13][9].color = letterX2;
        this.boxes[12][8].color = letterX2;
        this.boxes[15][4].color = letterX2;
        this.boxes[15][12].color = letterX2;
        this.boxes[8][12].color = letterX2;
        this.boxes[7][13].color = letterX2;
        this.boxes[9][13].color = letterX2;

        // Letter X3 Multiplier
        this.boxes[6][2].color = letterX3;
        this.boxes[6][14].color = letterX3;
        this.boxes[10][6].color = letterX3;
        this.boxes[10][10].color = letterX3;
        this.boxes[10][2].color = letterX3;
        this.boxes[10][14].color = letterX3;
        this.boxes[6][6].color = letterX3;
        this.boxes[6][10].color = letterX3;
        this.boxes[2][6].color = letterX3;
        this.boxes[2][10].color = letterX3;
        this.boxes[14][6].color = letterX3;
        this.boxes[14][10].color = letterX3;
    }

    private setUpMultipliers(): void {
        for (let j = 1; j < ARRAY_SIZE; j++) {
            for (let i = 1; i < ARRAY_SIZE; i++) {
                switch (this.boxes[j][i].color) {
                    case wordX2:
                        this.boxes[j][i].multiplier = Multiplier.LetterX2;
                        break;

                    case letterX3:
                        this.boxes[j][i].multiplier = Multiplier.LetterX3;
                        break;

                    case letterX2:
                        this.boxes[j][i].multiplier = Multiplier.LetterX2;
                        break;

                    case wordX3:
                        this.boxes[j][i].multiplier = Multiplier.WordX3;
                        break;
                }
            }
        }
    }

    private createBoxes(): void {
        this.boxes[0] = [];
        this.boxes[0][0] = { x: 0, y: 0, value: '', index: maxIndex, multiplier: Multiplier.Basic, color: white, available: true };

        for (let i = 1; i < ARRAY_SIZE; i++) {
            this.boxes[i] = [];
            for (let j = 1; j < ARRAY_SIZE; j++) {
                this.boxes[i][j] = { x: i, y: j, value: '', index: i * j, multiplier: Multiplier.Basic, color: white, available: true };
            }
        }
        for (let i = 1; i < ARRAY_SIZE; i++) {
            this.boxes[0][i] = {
                x: 0,
                y: i,
                value: i.toString(),
                index: boxesCount + i,
                multiplier: Multiplier.Basic,
                color: white,
                available: true,
            };
            this.boxes[i][0] = {
                x: i,
                y: 0,
                value: GRID_COLUMN[i],
                index: boxesCount + i * 2,
                multiplier: Multiplier.Basic,
                color: white,
                available: true,
            };
        }
    }
}
