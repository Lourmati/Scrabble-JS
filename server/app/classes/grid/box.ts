import { Multiplier } from '@app/classes/grid/multiplier';

export interface Box {
    x: number;
    y: number;
    value: string;
    index: number;
    multiplier: Multiplier;
    color: string;
    available: boolean;
}
