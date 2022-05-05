import { Injectable } from '@angular/core';
import { DEFAULT_TIME, MAX_TIME, MIN_TIME, ONE_SECONDS_IN_MS } from '@app/constants/timer';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    time: number;
    duration: number = DEFAULT_TIME;
    timeSubject: BehaviorSubject<number>;
    timerInterval: ReturnType<typeof setTimeout>;

    constructor(private readonly chatboxService: ChatboxService, private readonly gameService: GameService) {
        this.timeSubject = new BehaviorSubject<number>(DEFAULT_TIME);
    }
    /**
     * set la durée d'un tour
     *
     * @param duration durée du timer
     */
    setDuration(duration: number): void {
        if (this.isValidDuration(duration)) this.duration = duration;
    }
    /**
     * retourne vraie si la durée est valide
     *
     * @param duration durée du timer
     * @return true si la durée est valide
     */
    isValidDuration(duration: number): boolean {
        return MIN_TIME <= duration && duration <= MAX_TIME && duration % MIN_TIME === 0;
    }
    /**
     * Commence le timer
     */
    startTimer(): void {
        this.time = this.duration;
        this.timerInterval = setInterval(this.decreaseTimer.bind(this), ONE_SECONDS_IN_MS);
    }
    /**
     * décrémente la valeur du timer par une seconde
     */
    async decreaseTimer(): Promise<void> {
        this.time--;
        if (this.time === 0) {
            if (this.gameService.isCurrentPlayer) {
                this.chatboxService.emitMessage('!passer');
            }
            this.resetTimer();
        } else this.timeSubject.next(this.time);
    }
    /**
     * réinitialise le timer
     */
    resetTimer(): void {
        clearInterval(this.timerInterval);
        this.startTimer();
    }
    /**
     * get retourne
     */
    getTime(): Observable<number> {
        return this.timeSubject.asObservable();
    }
}
