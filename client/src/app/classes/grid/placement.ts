import { Vec2 } from './vec2';

export interface Placement {
    pos: Vec2;
    value: string;
    direction: AXIS;
}

export enum AXIS {
    Horizontal = 'h',
    Vertical = 'v',
}
