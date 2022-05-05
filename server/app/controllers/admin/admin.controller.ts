import { GameHistory } from '@app/classes/game-history/game-history';
import { GameMode } from '@app/classes/game/game-mode';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { DICTIONARIES_PATH, DICTIONARIES_PATH_ALT } from '@app/constants/dictionary';
import { GameHistoryService } from '@app/database/game-history/game-history.service';
import { DictionaryService } from '@app/services/dictionary/dictionary.service';
import { VirtualPlayerService } from '@app/services/virtual-player/virtual-player.service';
import { Router } from 'express';
import { existsSync } from 'fs';
import { StatusCodes } from 'http-status-codes';
import * as multer from 'multer';
import { join } from 'path';
import { cwd } from 'process';
import { Service } from 'typedi';

@Service()
export class AdminController {
    router: Router;

    constructor(
        private readonly dictionaryService: DictionaryService,
        private readonly virtualPlayerService: VirtualPlayerService,
        private readonly gameHistoryService: GameHistoryService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        const storage = multer.diskStorage({
            destination: DICTIONARIES_PATH_ALT,
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        });
        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
                if (file.mimetype !== 'application/json') cb(null, false);
                if (existsSync(join(cwd(), DICTIONARIES_PATH, file.originalname))) cb(null, false);
                cb(null, true);
            },
        });

        /**
         *
         *      Dictionnaires
         *
         */

        this.router.get('/dictionaries', (req, res) => {
            res.status(StatusCodes.OK).json(this.dictionaryService.getDictionaries(true));
        });

        this.router.post('/dictionaries', upload.single('dictionary'), (req, res) => {
            const path = req.file?.path;
            if (path && this.dictionaryService.addDictionary(path)) res.sendStatus(StatusCodes.CREATED);
            else res.sendStatus(StatusCodes.BAD_REQUEST);
        });

        this.router.delete('/dictionaries/reset', (req, res) => {
            if (this.dictionaryService.resetDictionaries()) res.sendStatus(StatusCodes.OK);
            else res.sendStatus(StatusCodes.NOT_FOUND);
        });

        this.router.delete('/dictionaries/:filename', (req, res) => {
            if (this.dictionaryService.deleteDictionary(req.params.filename)) res.sendStatus(StatusCodes.OK);
            else res.sendStatus(StatusCodes.NOT_FOUND);
        });

        this.router.patch('/dictionaries', (req, res) => {
            const dictionary = { filename: req.body.filename, title: req.body.title, description: req.body.description };
            if (this.dictionaryService.updateDictionary(dictionary)) res.sendStatus(StatusCodes.OK);
            else res.sendStatus(StatusCodes.NOT_FOUND);
        });

        /**
         *
         *      Noms des joueurs virtuels
         *
         */

        this.router.get('/names', (req, res) => {
            this.virtualPlayerService.getVirtualPlayerNames().then((data) => {
                res.status(StatusCodes.OK).json(data);
            });
        });

        this.router.post('/names', (req, res) => {
            this.virtualPlayerService.addName(req.body.name, req.body.level).then((status) => {
                if (status) res.sendStatus(StatusCodes.CREATED);
                else res.sendStatus(StatusCodes.BAD_REQUEST);
            });
        });

        this.router.patch('/names', (req, res) => {
            this.virtualPlayerService.editName(req.body.index, req.body.newName, req.body.level).then((status) => {
                if (status) res.sendStatus(StatusCodes.OK);
                else res.sendStatus(StatusCodes.NOT_FOUND);
            });
        });

        this.router.delete('/names/:level/:index', (req, res) => {
            this.virtualPlayerService.deleteName(parseInt(req.params.index, 10), parseInt(req.params.level, 10)).then((status) => {
                if (status) res.sendStatus(StatusCodes.OK);
                else res.sendStatus(StatusCodes.NOT_FOUND);
            });
        });

        this.router.delete('/names/reset', (req, res) => {
            this.virtualPlayerService.resetNames().then((status) => {
                if (status) res.sendStatus(StatusCodes.OK);
                else res.sendStatus(StatusCodes.NOT_FOUND);
            });
        });

        /**
         *
         *      Historique des parties
         *
         */

        this.router.get('/game-history', (req, res) => {
            this.gameHistoryService
                .getAllGameHistory()
                .then((gameHistory: GameHistory[]) => {
                    res.status(StatusCodes.OK).send(gameHistory);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/game-history', (req, res) => {
            this.gameHistoryService
                .deleteAllGameHistory()
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/game-history/:id', (req, res) => {
            this.gameHistoryService
                .deleteGameHistory(req.params.id)
                .then(() => {
                    res.sendStatus(StatusCodes.OK);
                })
                .catch((error: Error) => {
                    res.status(StatusCodes.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/populate', (req, res) => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            for (let i = 0; i < 10; i++) {
                this.gameHistoryService.addGame({
                    id: i.toString(),
                    start: new Date(),
                    duration: { minutes: 12, seconds: 34 },
                    players: [
                        { player: { id: '1', name: 'Player 1' }, score: 56 },
                        { player: { id: '2', name: 'Player 2' }, score: 78 },
                    ],
                    gameMode: GameMode.CLASSIC,
                });
            }
            res.sendStatus(StatusCodes.OK);
        });

        this.router.get('/populate2', (req, res) => {
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            for (let i = 0; i < 10; i++) {
                this.virtualPlayerService.addName('Player ' + i, i % 2 === 0 ? VirtualPlayerLevel.BEGINNER : VirtualPlayerLevel.EXPERT);
            }
            res.sendStatus(StatusCodes.OK);
        });
    }
}
