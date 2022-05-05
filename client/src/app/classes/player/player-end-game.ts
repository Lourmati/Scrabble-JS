import { PlayerInformations } from '@app/classes/player/player-informations';

export interface PlayerEndGame {
    winner: PlayerInformations;
    loser: PlayerInformations;
}
