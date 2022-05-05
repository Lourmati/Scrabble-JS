import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { ObjectId } from 'mongodb';
export const NAMES = ['Elon Musk', 'Satoshi Nakamoto', 'Jeff Bezos', 'Steve Jobs', 'Satya Nadella', 'Susan Wojcicki'];
export const ID = 'virtual-player-id';
export const INTERVAL_MS = 100;
export const MIN_THRESHOLD_MS = 3000;
export const MAX_THRESHOLD_MS = 20000;
export const PLACEMENT_DELAY = 5000;

export const NAMES_PATH = 'app/assets/virtual-player.json';
export const MIN_NAMES_COUNT = 3;
export const MAX_SCORE = 1000000;

export const DATABASE_COLLECTION = 'virtualPlayer';
export const ERROR_NUMBER = 500;
export const DUMMY_VP_NUMBER = 6;

export interface VirtualPlayer {
    _id?: ObjectId;
    name: string;
    level: VirtualPlayerLevel;
}

export const MOCK_VIRTUAL_PLAYER_BEGINNER: VirtualPlayer = {
    name: 'player1',
    level: VirtualPlayerLevel.BEGINNER,
};

export const MOCK_VIRTUAL_PLAYER_EXPERT: VirtualPlayer = {
    name: 'player3',
    level: VirtualPlayerLevel.EXPERT,
};

export const DUMMY_VP: VirtualPlayer[] = [
    {
        name: 'Elon Musk',
        level: VirtualPlayerLevel.BEGINNER,
    },
    {
        name: 'Bill Gates',
        level: VirtualPlayerLevel.BEGINNER,
    },
    {
        name: 'Vitalik Buterin',
        level: VirtualPlayerLevel.BEGINNER,
    },
    {
        name: 'Mark Zuckerberg',
        level: VirtualPlayerLevel.EXPERT,
    },
    {
        name: 'Jeff Bezos',
        level: VirtualPlayerLevel.EXPERT,
    },
    {
        name: 'Satoshi Nakamoto',
        level: VirtualPlayerLevel.EXPERT,
    },
];
