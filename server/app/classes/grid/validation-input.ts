import { Box } from './box';
import { Placement } from './placement';

export interface ValidationInput {
    placement: Placement;
    copyBoxes: Box[][];
    words: Box[][];
    lettersPlaced: Box[];
}
