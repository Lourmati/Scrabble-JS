import { AXIS } from '@app/classes/grid/axis';

export interface Vec2 {
    x: number;
    y: number;
}

export interface Placement {
    position: Vec2;
    letters: string;
    axis: AXIS;
}

export interface Coordinate {
    vec: Vec2;
    axis: AXIS;
}
