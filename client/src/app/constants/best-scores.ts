import { environment } from 'src/environments/environment';

export const BEST_SCORES_URL = environment.serverUrl + 'api/scores/score';
export const BEST_SCORE_CLASSIC = 'Classique';
export const BEST_SCORE_LOG2990 = 'Log2990';
export const BEST_SCORES_RESET_ENDPOINT = 'api/scores/resetScore';
export const DISPLAYED_COLUMNS = ['score', 'name'];
export enum ConnectionState {
    Available = 'Available',
    Undefined = 'Undefined',
    NotAvailable = 'NotAvailable',
}
