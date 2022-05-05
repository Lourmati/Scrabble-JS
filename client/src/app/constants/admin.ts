export const SNACKBAR_DURATION = 3000;

export const ENDPOINT_DICTIONARY = 'api/admin/dictionaries';
export const DICTIONARY_COLUMNS: string[] = ['title', 'description', 'filename', 'actions'];
export const DICTIONARY_TITLE_MAX_LENGTH = 64;
export const DICTIONARY_TITLE_MIN_LENGTH = 1;
export const DICTIONARY_DESCRIPTION_MAX_LENGTH = 256;
export const DICTIONARY_DESCRIPTION_MIN_LENGTH = 1;
export const DICTIONARY_EDIT_SUCCESS = 'Le dictionnaire a bien été modifié';
export const DICTIONARY_EDIT_FAILURE = "Le dictionnaire n'a pas pu être modifié";
export const DICTIONARY_DELETE_SUCCESS = 'Le dictionnaire a bien été supprimé';
export const DICTIONARY_DELETE_FAILURE = "Le dictionnaire n'a pas pu être supprimé";
export const DICTIONARY_ADD_SUCCESS = 'Le dictionnaire a bien été ajouté';
export const DICTIONARY_ADD_FAILURE = "Le dictionnaire n'a pas pu être ajouté";
export const DICTIONARY_CREATE_UPLOAD_FAILURE = 'Le dictionnaire doit être un fichier JSON de moins de 10MB';
export const DICTIONARY_RESET_SUCCESS = 'Les dictionnaires ont bien été réinitialisés';
export const DICTIONARY_RESET_FAILURE = "Les dictionnaires n'ont pas pu être réinitialisés";

export const DICTIONARY_FILE_MAX_SIZE = 10485760; // 10MB
export const DICTIONARY_FILE_TYPE = 'application/json';
export const DICTIONARY_DEFAULT = 'dictionnary.json';

export const ENDPOINT_VIRTUAL_PLAYER_NAMES = 'api/admin/names';
export const VIRTUAL_PLAYER_COLUMNS: string[] = ['name', 'actions'];
export const VIRTUAL_PLAYER_NAME_MIN_LENGTH = 1;
export const VIRTUAL_PLAYER_NAME_MAX_LENGTH = 32;
export const VIRTUAL_PLAYER_ADD_SUCCESS = 'Le nom a bien été ajouté';
export const VIRTUAL_PLAYER_ADD_FAILURE = "Le nom n'a pas pu être ajouté";
export const VIRTUAL_PLAYER_EDIT_SUCCESS = 'Le nom a bien été modifié';
export const VIRTUAL_PLAYER_EDIT_FAILURE = "Le nom n'a pas pu être modifié";
export const VIRTUAL_PLAYER_DELETE_SUCCESS = 'Le nom a bien été supprimé';
export const VIRTUAL_PLAYER_DELETE_FAILURE = "Le nom n'a pas pu être supprimé";
export const VIRTUAL_PLAYER_RESET_SUCCESS = 'Les noms ont bien été réinitialisés';
export const VIRTUAL_PLAYER_RESET_FAILURE = "Les noms n'ont pas pu être réinitialisés";

export const GAME_HISTORY_COLUMNS: string[] = ['gameMode', 'start', 'duration', 'name1', 'score1', 'name2', 'score2', 'actions'];
export const ENDPOINT_GAME_HISTORY = 'api/admin/game-history';
export const GAME_HISTORY_DELETE_SUCCESS = 'La partie a bien été supprimée';
export const GAME_HISTORY_DELETE_FAILURE = "La partie n'a pas pu être supprimée";
export const GAME_HISTORY_RESET_SUCCESS = "L'historique a bien été supprimé";
export const GAME_HISTORY_RESET_FAILURE = "L'historique n'a pas pu être supprimé";

export const BEST_SCORE_COLUMNS: string[] = ['name', 'score'];
export const BEST_SCORE_RESET_SUCCESS = 'Le classement a bien été réinitialisé';
export const BEST_SCORE_RESET_FAILURE = "Le classement n'a pas pu être réinitialisé";

export const RESET_ENDPOINT = '/reset';
