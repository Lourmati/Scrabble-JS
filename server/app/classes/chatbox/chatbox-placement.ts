import { Letter } from '@app/classes/common/letter';
import { AXIS } from '@app/classes/grid/axis';
import { Vec2 } from '@app/classes/grid/placement';

export interface ChatboxPlacement {
    position: Vec2;
    axis: AXIS;
    letters: Letter[];
}
