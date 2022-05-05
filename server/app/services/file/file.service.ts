import { Dictionary } from '@app/classes/common/dictionary';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class FileService {
    /**
     * Indique si un fichier existe
     *
     * @param path Chemin vers le fichier
     * @returns Booléen qui indique si le fichier existe
     */
    doesFileExist(path: string): boolean {
        return fs.existsSync(path);
    }

    /**
     * Retourne le contenu d'un fichier JSON sous forme d'objet
     *
     * @param path Chemin vers le fichier
     * @returns Contenu du fichier JSON sous forme d'objet
     */
    readJSONFile(path: string): { [key: string]: unknown } {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }

    /**
     * Écrit un dictionnaire dans un fichier
     *
     * @param path Chemin vers le fichier
     * @param data Données du dictionnaire
     */
    writeJSONFile(path: string, data: Dictionary): void {
        fs.writeFileSync(path, JSON.stringify(data));
    }

    /**
     * Supprime un fichier
     *
     * @param path Chemin vers le fichier
     * @returns Booléen qui indique si le fichier a été supprimé
     */
    deleteFile(path: string): boolean {
        if (!this.doesFileExist(path)) return false;
        fs.unlinkSync(path);
        return true;
    }

    /**
     * Retourne la liste des fichiers dans un répertoire
     *
     * @param path Chemin vers le répertoire
     * @returns Liste des fichiers dans le répertoire
     */
    getFilesInDirectory(path: string): string[] {
        return fs.readdirSync(path);
    }
}
