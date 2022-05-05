import { TestBed } from '@angular/core/testing';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { TimerService } from './timer.service';

describe('TimerService', () => {
    let service: TimerService;
    let duration: number;
    let chatboxServiceSpy: jasmine.SpyObj<ChatboxService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        duration = 60;
        chatboxServiceSpy = jasmine.createSpyObj('ChatboxService', ['emitMessage']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['isCurrentPlayer']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ChatboxService, useValue: chatboxServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
    });
    beforeEach(() => {
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set duration if set duration is called with a good value', () => {
        const value = 60;
        service.setDuration(duration);
        expect(service.duration).toBe(value);
    });
    it('should return true if duration is correct when isValidDuration is called', () => {
        const value = 120;
        expect(service.isValidDuration(value)).toBe(true);
    });
    it('should return false if duration is incorrect when isValidDuration is called', () => {
        const value = 125;
        expect(service.isValidDuration(value)).toBe(false);
    });
    it('should call setInterval when startTimer is called', () => {
        const spy = spyOn(window, 'setInterval');
        service.startTimer();
        expect(spy).toHaveBeenCalled();
    });
    it('should set time if startTimer is called', () => {
        const time = 0;
        service.startTimer();
        expect(service.time).toBe(time);
    });
    it('should decrease the timer when decreaseTimer is called', () => {
        service.time = duration;
        service.decreaseTimer();
        expect(service.time).toBe(duration - 1);
    });
    it('should call next function when decreaseTimer is called', () => {
        const spy = spyOn(service.timeSubject, 'next');
        service.time = duration;
        service.decreaseTimer();
        expect(spy).toHaveBeenCalled();
    });
    it('should call resetTimer when decreaseTimer is called and this.time is equal to 0', async () => {
        const spy = spyOn(service, 'resetTimer');
        service.time = 1;
        await service.decreaseTimer();
        expect(spy).toHaveBeenCalled();
    });
    it("should emit a message when time is equal to 0 and it's player's turn", async () => {
        gameServiceSpy.isCurrentPlayer = true;
        service.time = 1;
        await service.decreaseTimer();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalled();
    });

    it("should not emit a message when time is equal to 0 and it's not player's turn", async () => {
        gameServiceSpy.isCurrentPlayer = false;
        service.time = 1;
        await service.decreaseTimer();
        expect(chatboxServiceSpy.emitMessage).not.toHaveBeenCalled();
    });
    it('should not update duration if duration is called with a wrong value', () => {
        const wrongValue = 34;
        service.setDuration(wrongValue);
        expect(service.duration).toBe(0);
    });
    it('should not update duration if duration is called with a wrong value', () => {
        expect(service.getTime()).toEqual(service.timeSubject.asObservable());
    });
});
