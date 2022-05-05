import { GameMode } from '@app/classes/game/game-mode';

export interface GameParameters {
    timer: number;
    dictionary: string;
    mode: GameMode;
}
