import { Box } from './box';
import { Placement } from './placement';

export interface GenerationInput {
    boxes: Box[][];
    easelLetters: string[];
    possiblePlacements: Placement[];
}
