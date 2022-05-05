import { GameParameters } from '@app/classes/game/game-parameters';

export interface RoomInformations {
    id: string;
    playerName: string;
    parameters: GameParameters;
}
