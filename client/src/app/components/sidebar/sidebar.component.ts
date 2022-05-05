import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SidebarInformations, SidebarPlayerInformations } from '@app/classes/sidebar/sidebar-informations';
import { HUNDRED_PERCENT, MAX_ONE_DIGIT, ONE_MINUTE_IN_SECONDS } from '@app/constants/timer';
import { GameService } from '@app/services/game/game.service';
import { SidebarService } from '@app/services/sidebar/sidebar.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { TimerService } from '@app/services/timer/timer.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    info1: SidebarPlayerInformations;
    info2: SidebarPlayerInformations;
    reserveSize: number;
    color: ThemePalette;
    mode: ProgressSpinnerMode;
    value: number;
    currentPlayer: boolean;
    currentPlayerName: string;
    sidebarInformations: SidebarInformations;

    constructor(
        public sideBarService: SidebarService,
        public socketManagerService: SocketManagerService,
        public gameService: GameService,
        public timerService: TimerService,
    ) {
        this.color = 'primary';
        this.mode = 'determinate';
        this.value = ONE_MINUTE_IN_SECONDS;
    }

    ngOnInit(): void {
        this.setupTimer();
    }

    setupTimer(): void {
        this.timerSetUp();
        this.sideBarService.getSidebarInformations().subscribe((sidebarInformations: SidebarInformations) => {
            this.info1 = sidebarInformations.players[0];
            this.info2 = sidebarInformations.players[1];

            this.reserveSize = sidebarInformations.reserveSize;

            this.gameService.setCurrentPlayer(sidebarInformations.currentPlayerId);
            this.currentPlayer = this.gameService.isCurrentPlayer;

            this.currentPlayerName = this.gameService.getPlayerName();
            this.resetTimer(this.timerService.time);
        });

        this.timerService.getTime().subscribe((time: number) => {
            this.setTimer(time);
            this.value = HUNDRED_PERCENT - (this.timerService.time / this.timerService.duration) * HUNDRED_PERCENT;
        });
    }

    setTimer(numberOfSeconds: number): void {
        const timer = document.getElementById('timer') as HTMLElement;
        if (!timer) {
            clearInterval(this.timerService.timerInterval);
            return;
        }
        if (numberOfSeconds < 0) {
            timer.innerHTML = '0 : 00';
        } else {
            const minutes: number = Math.floor(numberOfSeconds / ONE_MINUTE_IN_SECONDS);
            timer.innerHTML = `${minutes} : ${
                numberOfSeconds % ONE_MINUTE_IN_SECONDS === 0
                    ? '00'
                    : numberOfSeconds % ONE_MINUTE_IN_SECONDS > 0 && numberOfSeconds % ONE_MINUTE_IN_SECONDS <= MAX_ONE_DIGIT
                    ? '0' + (numberOfSeconds % ONE_MINUTE_IN_SECONDS)
                    : numberOfSeconds % ONE_MINUTE_IN_SECONDS
            }`;
        }
    }

    resetTimer(time: number): void {
        if (time !== 0) this.timerService.resetTimer();
    }

    timerSetUp(): void {
        this.timerService.setDuration(this.gameService.getTimerDuration());
        this.timerService.startTimer();
    }
}
