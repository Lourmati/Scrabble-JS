import { Objective } from '@app/classes/objective/objective';
import { ObjectiveType } from '@app/classes/objective/objective-type';

export const OBJECTIVES_PRIVATE_NUMBER = 2;
export const OBJECTIVES_NUMBER = 4;
export const VOWELS_REGEX = /[aeiouy]/gi;
export const CONSONANTS_REGEX = /[^aeiouy]/gi;
export const VOWELS_BEGIN_END_REGEX = /^[aeiouy].*[aeiouy]$/;
export const LAST_POSITION = 15;

export const OBJECTIVES: Objective[] = [
    {
        id: '',
        title: 'Maitre des voyelles',
        description: 'Placer un mot avec 4 voyelles',
        points: 30,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 1,
    },
    {
        id: '',
        title: 'Solo Player',
        description: 'Atteindre 100 points sans utiliser !échanger ou !indice',
        points: 50,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 2,
    },
    {
        id: '',
        title: 'Usain Bolt',
        description: 'Faire un placement en moins de 10 secondes',
        points: 50,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 3,
    },
    {
        id: '',
        title: 'Maitre du palindrome',
        description: 'Former un palindrome',
        points: 30,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 4,
    },
    {
        id: '',
        title: 'Maitre de la langue française',
        description: 'Former un mot sans aucune consonne',
        points: 50,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 5,
    },
    {
        id: '',
        title: 'Voyelle double',
        description: 'Former un mot qui commence et termine avec une voyelle',
        points: 10,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 6,
    },
    {
        id: '',
        title: 'Toucher - Couler',
        description: 'Placer une lettre en position O15',
        points: 20,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 7,
    },
    {
        id: '',
        title: "Maitre de l'anagramme",
        description: 'Former un mot qui est anagramme avec un mot déja présent sur la grid',
        points: 25,
        type: ObjectiveType.PUBLIC,
        checked: false,
        done: false,
        code: 8,
    },
];
export const VOWELS_NUMBER = 4;
export const MINIMUM_TIME = 10;
export const HUNDRED_POINTS = 100;

export const OBJECTIVES_1 = 1;
export const OBJECTIVES_2 = 2;
export const OBJECTIVES_3 = 3;
export const OBJECTIVES_4 = 4;
export const OBJECTIVES_5 = 5;
export const OBJECTIVES_6 = 6;
export const OBJECTIVES_7 = 7;
export const OBJECTIVES_8 = 8;
