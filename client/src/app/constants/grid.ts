import { AXIS } from '@app/classes/grid/placement';

export const WORD_OFFSET = 5;
export const ARRAY_SIZE = 16;
export const OFFSET = 32;
export const FONT_SIZE_OFFSET = 1;
export const LAST_ELEMENT = -1;
export const DEFAULT_PLACEMENT = { value: '', pos: { x: 0, y: 0 }, direction: AXIS.Horizontal };

export const YELLOW = '#FFFF00';
export const BLACK = 'black';

export const GRID_OFFSET = 50;
export const CENTER = { x: 8, y: 8 };

export const STAR_FONT = '40px system-ui';
export const STAR = '\u2605';
export const STAR_DIVIDER = 4;
export const HORIZONTAL_ARROW = '\u2192';
export const VERTICAL_ARROW = '\u2193';
export const INDICATORS_FONT = '20px system-ui';

export const ALPHABET_REGEX = /[a-zA-Z]/;
export const NORMALIZE_MODE = 'NFD';
export const REMOVE_SYMBOLS_REGEX = /[\u0300-\u036f]/g;
export const GRID_COLUMN = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
export const FONT_CONSTANTS = {
    maxFontSize: 25,
    minFontSize: 12,
    defaultFontSize: 18,
    defaultMultiplierFont: '10px system-ui',
    arrowStyle: '25px system-ui',
};

// Should be done with a theming service
export const MULTIPLIERS_COLORS = {
    wordX3: '#cb0000',
    wordX2: '#ff999a',
    letterX2: '#99c9f1',
    letterX3: '#007acd',
    white: '#ffffff',
};

export const GRID_CONSTANTS = {
    defaultWidth: 800,
    defaultHeight: 800,
    minWidth: 650,
    minHeight: 650,
    maxHeight: 900,
    maxWidth: 900,
    gridColumn: ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'],
};

export const BOX_DIMENSIONS = {
    boxesCount: 225,
    maxIndex: 257,
    defaultBoxWidth: GRID_CONSTANTS.defaultWidth / ARRAY_SIZE,
    defaultBoxHeight: GRID_CONSTANTS.defaultHeight / ARRAY_SIZE,
    boxOffset: GRID_CONSTANTS.defaultHeight / OFFSET,
};

export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

export enum Multiplier {
    WordX3 = 'WORD X3',
    WordX2 = 'WORD X2',
    LetterX2 = 'LETTER X2',
    LetterX3 = 'LETTER X3',
    Basic = 'BASIC',
}
