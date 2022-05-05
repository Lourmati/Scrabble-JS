import { Multiplier } from '@app/constants/grid';

export interface Box {
    x: number;
    y: number;
    value: string;
    index: number;
    multiplier: Multiplier;
    color: string;
    available: boolean;
}
