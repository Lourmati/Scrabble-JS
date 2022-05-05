import { Score } from '@app/classes/scores-information/score-information';
import { MODE_CLASSIQUE, MODE_LOG2990 } from '@app/constants/best-scores';
import { ScoresService } from '@app/database/score/score.service';
import { Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';
@Service()
export class ScoresController {
    router: Router;

    constructor(private scoresService: ScoresService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.delete('/resetScore', (req: Request, res: Response) => {
            this.scoresService
                .resetScores()
                .then(() => {
                    res.sendStatus(Httpstatus.StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/scoreClassique', async (req: Request, res: Response) => {
            this.scoresService
                .getBestScores(MODE_CLASSIQUE)
                .then((scores: Score[]) => {
                    res.status(Httpstatus.StatusCodes.OK).send(scores);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
        this.router.get('/scoreLog2990', async (req: Request, res: Response) => {
            this.scoresService
                .getBestScores(MODE_LOG2990)
                .then((scores: Score[]) => {
                    res.status(Httpstatus.StatusCodes.OK).send(scores);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
