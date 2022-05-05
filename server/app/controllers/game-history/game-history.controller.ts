import { GameHistory } from '@app/classes/game-history/game-history';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { Service } from 'typedi';

@Service()
export class GameHistoryController {
    router: Router;
    constructor(private gameHistoryService: GameHistoryService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.get('/gameHistory', async (req: Request, res: Response) => {
            this.gameHistoryService
                .getAllGameHistory()
                .then((gameHistory: GameHistory[]) => {
                    res.status(Httpstatus.StatusCodes.OK).send(gameHistory);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.StatusCodes.NOT_FOUND).send(error.message);
                });
        });
    }
}
