import { Score } from '@app/classes/scores-information/score-information';
import { ScoresService } from '@app/database/score/score.service';
import 'reflect-metadata';
import { Service } from 'typedi';

@Service()
export class ScoreHandler {
    constructor(private scoreService: ScoresService) {}

    /**
     * Cette méthode ajoute des scores fictives à la collection
     */
    async resetScores(): Promise<void> {
        await this.scoreService.deleteAllScores();
        await this.scoreService.addDummyScores();
    }

    /**
     * Cette méthode ajoute un score à la collection
     * Si le score du joueur n'existe pas on l'ajoute
     * Sinon, on ajoute le nom du joueur aux joueurs du score si il est pas présent dedans
     *
     * @param playerScore le score du jouer à ajouté à la fin de la partie
     */
    async setScore(playerScore: Score): Promise<void> {
        const score = await this.scoreService.getScoreByPlayerModeAndScore(playerScore);
        if (score.length === 0) await this.scoreService.addScore(playerScore);
        else {
            if (!score[0].name.includes(playerScore.name[0])) await this.scoreService.updateScoreName(playerScore);
        }
    }
}
