import { Box } from '@app/classes/grid/box';

export interface PlacementData {
    validity: boolean;
    score: number;
    placedWords: Box[][];
}
