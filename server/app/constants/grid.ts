import { Multiplier } from '@app/classes/grid/multiplier';

/* eslint-disable @typescript-eslint/no-magic-numbers */
export const WORD_X3_INDEX = [1, 8, 15];
export const WORD_X2_INDEX = [2, 3, 4, 5, 11, 12, 13, 14];
export const MULTIPLIERS_COLORS = {
    wordX3: '#cc0000',
    wordX2: '#ff9999',
    letterX2: '#99c9f0',
    letterX3: '#007acc',
    white: '#ffffff',
};
export const BOX_DIMENSIONS = {
    boxesCount: 225,
    maxIndex: 257,
};
export const ARRAY_SIZE = 16;
export const GRID_COLUMN = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const COLOR_TO_MULTIPLIER = {
    [MULTIPLIERS_COLORS.wordX3]: Multiplier.WordX3,
    [MULTIPLIERS_COLORS.wordX2]: Multiplier.WordX2,
    [MULTIPLIERS_COLORS.letterX2]: Multiplier.LetterX2,
    [MULTIPLIERS_COLORS.letterX3]: Multiplier.LetterX3,
    [MULTIPLIERS_COLORS.white]: Multiplier.Basic,
};
