import { Score } from '@app/classes/scores-information/score-information';

export const DATABASE_NAME = 'LOG2990-205';
export const DATABASE_URL = 'mongodb+srv://equipe205:equipe205@cluster0.gzu5f.mongodb.net/LOG2990-205?retryWrites=true&w=majority';
export const DATABASE_CONNEXION_ERROR = 'Database connection error';
export const SCORE_NUMBER_LIMIT = 5;
export const DATABASE_COLLECTION = 'Scores';
export const MODE_CLASSIQUE = 'Classique';
export const MODE_LOG2990 = 'Log2990';
export const DESCENDING_ORDER = -1;
export const DUMMY_SCORE_NUMBER = 10;
export const ERROR_NUMBER = 500;
export const DUMMY_SCORES: Score[] = [
    {
        name: ['Romeo'],
        score: 5,
        playerMode: 'Classique',
    },
    {
        name: ['Shaun'],
        score: 4,
        playerMode: 'Classique',
    },
    {
        name: ['Lyla'],
        score: 3,
        playerMode: 'Classique',
    },
    {
        name: ['Bryant'],
        score: 2,
        playerMode: 'Classique',
    },
    {
        name: ['Yadiel'],
        score: 1,
        playerMode: 'Classique',
    },
    {
        name: ['Racim'],
        score: 5,
        playerMode: 'Log2990',
    },
    {
        name: ['Djawed'],
        score: 4,
        playerMode: 'Log2990',
    },
    {
        name: ['Adam'],
        score: 3,
        playerMode: 'Log2990',
    },
    {
        name: ['Kenzy'],
        score: 2,
        playerMode: 'Log2990',
    },
    {
        name: ['Malek'],
        score: 1,
        playerMode: 'Log2990',
    },
];
