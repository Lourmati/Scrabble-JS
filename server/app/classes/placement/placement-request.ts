import { Box } from '@app/classes/grid/box';
import { ScoreConstraint } from '@app/classes/virtual-player/score-constraints';

export interface PlacementRequest {
    easel: string[];
    grid: Box[][];
    isGridEmpty: boolean;
    constraints?: ScoreConstraint;
}
