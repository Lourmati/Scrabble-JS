import { Dictionary } from '@app/classes/common/dictionary';
import { DictionaryInformations } from '@app/classes/dictionary/dictionary-informations';
import { DEFAULT_DICTIONARY, DEFAULT_DICTIONARY_TITLE, DICTIONARIES_PATH } from '@app/constants/dictionary';
import { PATH_SEPARATOR } from '@app/constants/file';
import { EVENT_DICTIONARY_UPDATED } from '@app/constants/socket';
import { FileService } from '@app/services/file/file.service';
import { SocketCommunicationService } from '@app/services/socket-communication/socket-communication.service';
import { cwd } from 'process';
import { Service } from 'typedi';

@Service()
export class DictionaryService {
    dictionaryPath: string;
    defaultDictionary: string;
    toDelete: string[];
    usage: Map<string, number>;
    gameIdToFilename: Map<string, string>;
    gameIdToDictionary: Map<string, Dictionary>;

    constructor(private readonly fileService: FileService, private readonly socketCommunicationService: SocketCommunicationService) {
        this.dictionaryPath = cwd() + DICTIONARIES_PATH;
        this.defaultDictionary = this.dictionaryPath + PATH_SEPARATOR + DEFAULT_DICTIONARY;
        this.toDelete = [];
        this.usage = new Map();
        this.gameIdToFilename = new Map();
        this.gameIdToDictionary = new Map();
    }

    /**
     * Retourne les dictionnaires disponibles
     *
     * @param asAdmin Inclut les dictionnaires en attente de suppression
     * @returns Liste des dictionnaires disponibles
     */
    getDictionaries(asAdmin: boolean): DictionaryInformations[] {
        return this.fileService
            .getFilesInDirectory(this.dictionaryPath)
            .filter((filename: string) => (asAdmin ? true : !this.toDelete.includes(filename)))
            .map((filename: string) => {
                const data = this.fileService.readJSONFile(this.dictionaryPath + PATH_SEPARATOR + filename);
                return { title: data.title as string, description: data.description as string, filename };
            });
    }

    /**
     * Retourne le dictionnaire utilisé dans une partie
     *
     * @param gameId Identifiant de la partie
     * @returns Dictionnaire utilisé par la partie
     */
    getDictionaryByGameId(gameId: string): Dictionary {
        let dictionary = this.gameIdToDictionary.get(gameId);
        if (dictionary) return dictionary;

        const filename = this.gameIdToFilename.get(gameId);
        if (!filename) dictionary = this.getDictionary(DEFAULT_DICTIONARY);
        else dictionary = this.getDictionary(filename);

        this.gameIdToDictionary.set(gameId, dictionary);
        return dictionary;
    }

    /**
     * Retourne le dictionnaire contenu dans un fichier
     *
     * @param filename Nom du fichier contenant le dictionnaire
     * @returns Dictionnaire contenu dans le fichier
     */
    getDictionary(filename: string): Dictionary {
        const path = this.dictionaryPath + PATH_SEPARATOR + filename;
        if (this.fileService.doesFileExist(path)) return this.fileService.readJSONFile(path) as unknown as Dictionary;
        else return this.fileService.readJSONFile(this.defaultDictionary) as unknown as Dictionary;
    }

    /**
     * Retourne le titre d'un dictionnaire
     *
     * @param filename Nom du fichier contenant le dictionnaire
     * @returns Titre du dictionnaire
     */
    getTitle(filename: string): string {
        const path = this.dictionaryPath + PATH_SEPARATOR + filename;
        if (this.fileService.doesFileExist(path)) return (this.fileService.readJSONFile(path) as unknown as Dictionary).title;
        else return DEFAULT_DICTIONARY_TITLE;
    }

    /**
     * Réserve un dictionnaire (empêche sa suppression)
     *
     * @param gameId Identifiant de la partie
     * @param filename Nom du fichier contenant le dictionnaire
     */
    useDictionary(gameId: string, filename: string): void {
        const value = this.usage.get(filename);
        if (!value) this.usage.set(filename, 1);
        else this.usage.set(filename, value + 1);
        this.gameIdToFilename.set(gameId, filename);
    }

    /**
     * Relâche un dictionnaire (et le supprime s'il doit être supprimé)
     *
     * @param gameId Identifiant de la partie
     * @param filename Nom du fichier contenant le dictionnaire
     */
    releaseDictionary(gameId: string, filename: string): void {
        const value = this.usage.get(filename);
        this.gameIdToFilename.delete(gameId);
        this.gameIdToDictionary.delete(gameId);
        if (!value) return;
        this.usage.set(filename, value - 1);
        if (value - 1 <= 0 && this.toDelete.includes(filename)) {
            this.deleteDictionary(filename);
            this.toDelete.splice(this.toDelete.indexOf(filename), 1);
        }
    }

    /**
     * Indique si un dictionnaire avec ce titre existe déjà
     *
     * @param title Titre du dictionnaire
     * @param filename Nom du fichier contenant le dictionnaire
     * @returns Booléen qui indique si le titre existe déjà
     */
    doesTitleAlreadyExist(title: string, filename: string): boolean {
        for (const file of this.fileService.getFilesInDirectory(this.dictionaryPath)) {
            const data = this.fileService.readJSONFile(this.dictionaryPath + PATH_SEPARATOR + file) as unknown as Dictionary;
            if (file !== filename && data.title === title) return true;
        }
        return false;
    }

    /**
     * Ajoute un dictionnaire
     *
     * @param path Chemin vers le dictionnaire
     * @returns Booléen qui indique si le dictionnaire a été ajouté
     */
    addDictionary(path: string): boolean {
        if (!this.fileService.doesFileExist(path)) return false;
        const title = (this.fileService.readJSONFile(path) as unknown as Dictionary).title;
        if (this.doesTitleAlreadyExist(title, path.split(PATH_SEPARATOR).pop() as string)) {
            this.fileService.deleteFile(path);
            return false;
        }
        this.updateAvailableDictionaries();
        return true;
    }

    /**
     * Met à jour un dictionnaire
     *
     * @param editedDictionary Informations mises à jour
     * @returns Booléen qui indique si le dictionnaire a été modifié
     */
    updateDictionary(editedDictionary: DictionaryInformations): boolean {
        if (this.doesTitleAlreadyExist(editedDictionary.title, editedDictionary.filename)) return false;
        const path = this.dictionaryPath + PATH_SEPARATOR + editedDictionary.filename;
        if (!this.fileService.doesFileExist(path)) return false;

        const dictionary = this.fileService.readJSONFile(path) as unknown as Dictionary;
        dictionary.title = editedDictionary.title;
        dictionary.description = editedDictionary.description;
        this.fileService.writeJSONFile(path, dictionary);
        this.updateAvailableDictionaries();
        return true;
    }

    /**
     * Supprime un dictionnaire
     *
     * @param filename Nom du fichier contenant le dictionnaire
     * @returns Booléen qui indique si le dictionnaire a été supprimé
     */
    deleteDictionary(filename: string): boolean {
        if (filename === DEFAULT_DICTIONARY) return false;
        let status = false;
        if (this.usage.get(filename) || 0 > 0) {
            this.toDelete.push(filename);
            status = true;
        } else {
            status = this.fileService.deleteFile(this.dictionaryPath + PATH_SEPARATOR + filename);
        }
        this.updateAvailableDictionaries();
        return status;
    }

    /**
     * Met à jour la liste des dictionnaires disponibles
     */
    updateAvailableDictionaries(): void {
        this.socketCommunicationService.emitToBroadcast(EVENT_DICTIONARY_UPDATED, this.getDictionaries(false));
    }

    /**
     * Réinitialise la liste des dictionnaires disponibles
     *
     * @returns Booléen qui indique si la liste a été réinitialisée
     */
    resetDictionaries(): boolean {
        this.fileService.getFilesInDirectory(this.dictionaryPath).map((filename: string) => {
            if (filename !== DEFAULT_DICTIONARY) this.deleteDictionary(filename);
        });
        return true;
    }
}
