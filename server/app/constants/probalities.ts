import { ScoreConstraint } from '@app/classes/virtual-player/score-constraints';
import { VirtualPlayerCommand } from '@app/classes/virtual-player/virtual-player-commands';
export type Option<T> = { element: T; probability: number };
export const COMMAND_PROBABILITY_MAP: Option<VirtualPlayerCommand>[] = [
    { element: VirtualPlayerCommand.PLACE, probability: 0.8 },
    { element: VirtualPlayerCommand.EXCHANGE, probability: 0.1 },
    { element: VirtualPlayerCommand.TAKETURN, probability: 0.1 },
];

export const SCORE_CONSTRAINT_PROBABILITY_MAP: Option<ScoreConstraint>[] = [
    { element: { minScore: 0, maxScore: 6 }, probability: 0.4 },
    { element: { minScore: 7, maxScore: 12 }, probability: 0.3 },
    { element: { minScore: 13, maxScore: 18 }, probability: 0.3 },
];
