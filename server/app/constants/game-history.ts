import { GameHistory } from '@app/classes/game-history/game-history';
import { GameMode } from '@app/classes/game/game-mode';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { PlayerScore } from '@app/classes/player/player-score';

const MOCK_PLAYER_1: PlayerInformations = { id: '1', name: 'player1' };
const MOCK_PLAYER_2: PlayerInformations = { id: '2', name: 'player2' };
const MOCK_PLAYER_SCORE_1: PlayerScore = { player: MOCK_PLAYER_1, score: 234 };
const MOCK_PLAYER_SCORE_2: PlayerScore = { player: MOCK_PLAYER_2, score: 454 };
export const MOCK_GAME_CLASSIQUE: GameHistory = {
    id: '1',
    start: new Date('2024-03-01'),
    duration: { minutes: 35, seconds: 56 },
    players: [MOCK_PLAYER_SCORE_1, MOCK_PLAYER_SCORE_2],
    gameMode: GameMode.CLASSIC,
};

export const MOCK_GAME_LOG2990: GameHistory = {
    id: '2',
    start: new Date('2022-03-01'),
    duration: { minutes: 22, seconds: 37 },
    players: [MOCK_PLAYER_SCORE_1, MOCK_PLAYER_SCORE_2],
    gameMode: GameMode.LOG2990,
};

export const DATABASE_COLLECTION = 'gameHistory';
export const DESCENDING_ORDER = -1;
