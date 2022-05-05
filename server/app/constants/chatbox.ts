// Expression régulières
export const REGEX_COMMAND = /^!([^ ]*) */;
export const REGEX_PLACE_WITH_ORIENTATION = /^!placer ([a-o])([1-9]|1[0-5])(h|v) ([a-zA-Z*]+)$/;
export const REGEX_PLACE_WITHOUT_ORIENTATION = /^!placer ([a-o])([1-9]|1[0-5]) ([a-zA-Z*])$/;
export const REGEX_EXCHANGE = /^!échanger ([a-zA-Z*]+)$/;
export const REGEX_PASS = /^!passer$/;
export const REGEX_RESERVE = /^!réserve$/;
export const REGEX_HINTS = /^!indice$/;
export const REGEX_HELP = /^!aide$/;

// Position des informations dans la commande placer
export const INDEX_X_POSITION = 1;
export const INDEX_Y_POSITION = 2;
export const INDEX_ORIENTATION = 3;
export const INDEX_LETTERS = 4;
export const DECIMAL_BASE = 10;

// Messages d'erreur
export const ERROR_NO_HINTS = 'Aucun indice disponible';
export const ERROR_SYNTAX = 'Il y a une erreur de syntaxe dans ce message';
export const ERROR_INVALID_COMMAND = 'Cette entrée est invalide';
export const ERROR_NOT_YOUR_TURN = "Ce n'est pas à vous de jouer";
export const ERROR_PLACEMENT = 'Ce placement est impossible';
export const ERROR_EXCHANGE = 'Vous ne pouvez pas échanger ces lettres';

export const A_LETTER_PADDING = 96;
export const HORIZONTAL_CHAR = 'h';
export const CHATBOX_HELP_MESSAGE = `
Commandes disponibles :

Placer des lettres :
!placer <ligne><colonne>[(h|v)] <lettres>

Échanger des lettres :
!échanger <lettre>

Passer son tour :
!passer

Afficher la réserve :
!réserve

Obtenir des indices :
!indice

Afficher ce message :
!aide
`;
export const COMMANDS_LIST = ['placer', 'échanger', 'passer', 'réserve', 'indice', 'aide'];
export const SERVER_ID = 'server';
export const SERVER_NAME = 'Server';
export const CHATBOX_EVENT = 'chatbox:message';
