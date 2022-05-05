import { TestBed } from '@angular/core/testing';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { GameService } from '@app/services/game/game.service';
import { PassTurnService } from '@app/services/pass-turn/pass-turn.service';
import { BehaviorSubject, Observable } from 'rxjs';
import SpyObj = jasmine.SpyObj;

describe('PassTurnService', () => {
    let service: PassTurnService;
    let gameServiceSpy: SpyObj<GameService>;
    let chatBoxServiceSpy: SpyObj<ChatboxService>;
    let currentPlayerObservable: BehaviorSubject<boolean>;

    beforeEach(() => {
        currentPlayerObservable = new BehaviorSubject<boolean>(false);
        chatBoxServiceSpy = jasmine.createSpyObj('ChatBoxService', ['emitMessage']);
        gameServiceSpy = jasmine.createSpyObj('GameService', ['getCurrentPlayerObservable']);
        gameServiceSpy.getCurrentPlayerObservable.and.returnValue(currentPlayerObservable.asObservable());
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: ChatboxService, useValue: chatBoxServiceSpy },
            ],
        });
        service = TestBed.inject(PassTurnService);
    });

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should call emitMessage when passTurn is called', () => {
        service.passTurn();
        expect(chatBoxServiceSpy.emitMessage).toHaveBeenCalledWith('!passer');
    });

    it('Should return an observable when isCurrentPlayer is called ', () => {
        expect(service.isCurrentPlayer()).toBeInstanceOf(Observable);
        expect(gameServiceSpy.getCurrentPlayerObservable).toHaveBeenCalled();
    });
});
