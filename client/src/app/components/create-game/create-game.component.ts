import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DictionaryInformations } from '@app/classes/admin/dictionary-informations';
import { GameMode } from '@app/classes/game/game-mode';
import { GameType } from '@app/classes/game/game-type';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { DICTIONARY_DEFAULT } from '@app/constants/admin';
import { LEVEL_DEFAULT, LEVEL_OPTIONS, NAME_MAX_LENGTH, NAME_PATTERN, TIMER_DEFAULT, TIMER_OPTIONS } from '@app/constants/create-game';
import { GAME_CREATE_SOLO } from '@app/constants/events';
import { CREATE_URL, GAME_PAGE_PATH } from '@app/constants/game';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';

@Component({
    selector: 'app-create-game',
    templateUrl: './create-game.component.html',
    styleUrls: ['./create-game.component.scss'],
})
export class CreateGameComponent implements OnInit {
    @Input() gameType: GameType;
    name: string = '';
    timer: number = TIMER_DEFAULT;
    level: VirtualPlayerLevel = LEVEL_DEFAULT;
    timerOptions = TIMER_OPTIONS;
    dictionary: string = DICTIONARY_DEFAULT;
    dictionaryOptions: { name: string; value: string }[] = [];
    levelOptions = LEVEL_OPTIONS;
    confirmed: boolean;
    backLink: string;
    paramsForm: FormGroup;
    constructor(
        private readonly router: Router,
        private readonly roomService: RoomService,
        private readonly gameService: GameService,
        private readonly socketManagerService: SocketManagerService,
    ) {}
    ngOnInit(): void {
        this.gameService.updateAvailableDictionaries();
        this.backLink =
            this.gameType === GameType.SOLO
                ? this.router.url.substring(0, this.router.url.length - 'solo'.length)
                : this.router.url.substring(0, this.router.url.length - CREATE_URL.length);
        this.paramsForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.maxLength(NAME_MAX_LENGTH), Validators.pattern(NAME_PATTERN)]),
            dictionary: new FormControl(DICTIONARY_DEFAULT),
            timer: new FormControl(TIMER_DEFAULT),
        });
        this.gameService.getAvailableDictionaries().subscribe((dictionaries: DictionaryInformations[]) => {
            this.dictionaryOptions = dictionaries.map((dictionary: DictionaryInformations) => {
                return { name: dictionary.title, value: dictionary.filename };
            });
        });
    }

    createGame(): void {
        if (this.gameType === GameType.MULTIPLAYER) {
            this.createRoom();
        } else {
            const gameMode = this.router.url.includes('log2990') ? GameMode.LOG2990 : GameMode.CLASSIC;
            this.gameService.setId(this.socketManagerService.getId());
            this.gameService.setPlayer(this.paramsForm.value.name);
            this.gameService.setTimerDuration(this.timer);
            this.socketManagerService.emit(
                GAME_CREATE_SOLO,
                this.paramsForm.value.name,
                { timer: this.timer, dictionary: this.dictionary, mode: gameMode },
                this.level,
            );

            const query = this.router.url.includes('log2990') ? 'log2990' : 'classic';
            this.router.navigate([GAME_PAGE_PATH], { queryParams: { mode: query } });
        }
    }

    createRoom(): void {
        const gameMode = this.router.url.includes('log2990') ? GameMode.LOG2990 : GameMode.CLASSIC;
        this.roomService.createRoom(this.paramsForm.value.name, { timer: this.timer, dictionary: this.dictionary, mode: gameMode });
        this.router.navigate([this.backLink + 'waiting']);
    }

    confirm(): void {
        this.confirmed = true;
    }
}
