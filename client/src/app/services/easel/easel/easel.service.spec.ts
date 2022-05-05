import { TestBed } from '@angular/core/testing';
import { Letter } from '@app/classes/common/letter';
import { Direction } from '@app/classes/direction/direction';
import { CommandService } from '@app/services/command/command.service';
import { EaselService } from '@app/services/easel/easel/easel.service';
import SpyObj = jasmine.SpyObj;
const MOCK_CARD = { letter: 'A', point: 0 };
const MOCK_INDEX = 0;
const SELECTION_NULL = -1;
describe('EaselService', () => {
    let service: EaselService;
    let card: Letter;
    let commandServiceSpy: SpyObj<CommandService>;

    beforeEach(() => {
        commandServiceSpy = jasmine.createSpyObj('CommandService', ['exchange']);
        card = { letter: 'A', point: 9 };
        TestBed.configureTestingModule({ providers: [{ provide: CommandService, useValue: commandServiceSpy }] });
        service = TestBed.inject(EaselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('addExchangeCard should add letter to exchange', () => {
        const length = service.exchange.length;
        service.addExchangeCard(card);
        expect(service.exchange.length).toBe(length + 1);
    });
    it('removeExchangeCard should remove letter from exchange', () => {
        service.addExchangeCard(card);
        const length = service.exchange.length;
        service.removeExchangeCard(card);
        expect(service.exchange.length).toBe(length - 1);
    });
    it('call next when exchange is empty', () => {
        const spy = spyOn(service.onExchange, 'next');
        service.reset();
        service.addExchangeCard(card);
        service.removeExchangeCard(card);
        expect(spy).toHaveBeenCalledWith(false);
    });
    it('call next when exchange is empty', () => {
        service.addExchangeCard(card);
        service.exchange.push({ letter: 'A', point: 0 });
        const length = service.exchange.length;
        service.removeExchangeCard(card);
        expect(service.exchange.length).toBe(length - 1);
    });
    it('makeSelection should make a selection a letter', () => {
        service.makeSelection(card, 0);
        expect(service.selection.value).toBe(card);
        expect(service.selectionIndex).toBe(0);
    });
    it('removeSelection should make selection undefined', () => {
        service.makeSelection(card, MOCK_INDEX);
        service.removeSelection();
        expect(service.selection.value).toBe(null);
        expect(service.selectionIndex).toBe(SELECTION_NULL);
    });
    it('reset should reset selection and exchange', () => {
        service.addExchangeCard(card);
        service.makeSelection({ letter: 'B', point: 9 }, 0);
        service.reset();
        expect(service.exchange.length).toBe(0);
        expect(service.selection.value).toBe(null);
    });
    it('hasSelection should return true if selection is defined', () => {
        service.makeSelection(card, MOCK_INDEX);
        expect(service.hasSelection()).toBe(true);
    });
    it('hasSlection should return false if selection is undefined', () => {
        service.removeSelection();
        expect(service.hasSelection()).toBe(false);
    });
    it('isSelectionCard should return true if card is selection Card', () => {
        service.makeSelection(card, MOCK_INDEX);
        expect(service.isSelectionCard(card, MOCK_INDEX)).toBe(true);
    });
    it('isSelectionCard should return false if card is not selection Card', () => {
        service.makeSelection({ letter: 'B', point: 9 }, 0);
        expect(service.isSelectionCard(card, 0)).toBe(false);
    });
    it('isSelectionCard should return false if selection card isundefined', () => {
        service.removeSelection();
        expect(service.isSelectionCard(card, MOCK_INDEX)).toBe(false);
    });
    it('exchangeHasCard shoould return true if card is in exchange', () => {
        service.addExchangeCard(card);
        expect(service.exchangeHasCard(card)).toBe(true);
    });
    it('exchangeHasCard shoould return false if card is not in exchange', () => {
        expect(service.exchangeHasCard(card)).toBe(false);
    });
    it('call exchange method of command Service', () => {
        service.exchangeLetters();
        expect(commandServiceSpy.exchange).toHaveBeenCalled();
    });
    it('call asObservable when getSelection is called', () => {
        const spy = spyOn(service.selection, 'asObservable');
        service.getSelection();
        expect(spy).toHaveBeenCalled();
    });
    it('call asObservable when onExchange is called', () => {
        const spy = spyOn(service.onExchange, 'asObservable');
        service.getExchange();
        expect(spy).toHaveBeenCalled();
    });
    it('selectionCanBeMovedRight should return false if slection is at the boundary', () => {
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        service.makeSelection(MOCK_CARD, MOCK_INDEX + 1);
        expect(service.selectionCanBeMoved(Direction.RIGHT)).toBeFalse();
    });
    it('selectionCanBeMovedLeft should return false if slection is at the beginning', () => {
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        service.makeSelection(MOCK_CARD, MOCK_INDEX);
        expect(service.selectionCanBeMoved(Direction.LEFT)).toBeFalse();
    });
    it('should move Left the selection', () => {
        service.makeSelection(MOCK_CARD, 1);
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        const index = service.selectionIndex;
        service.move(Direction.LEFT);
        const newIndex = index - 1;
        expect(newIndex).toBe(index - 1);
    });
    it('should move right the selection', () => {
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        service.makeSelection(MOCK_CARD, MOCK_INDEX);
        const index = service.selectionIndex;
        service.move(Direction.RIGHT);
        const newIndex = index + 1;
        expect(service.selectionIndex).toBe(newIndex);
    });
    it('should call swapCards when moving right', () => {
        service.makeSelection(MOCK_CARD, MOCK_INDEX);
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        const spy = spyOn(service, 'swapCards');
        service.move(Direction.RIGHT);
        expect(spy).toHaveBeenCalled();
    });
    it('should not call swapCards when moving right', () => {
        service.makeSelection(MOCK_CARD, MOCK_INDEX + 1);
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        const spy = spyOn(service, 'swapCards');
        service.move(Direction.RIGHT);
        expect(spy).not.toHaveBeenCalled();
    });
    it('should not call swapCards when moving left', () => {
        service.makeSelection(MOCK_CARD, MOCK_INDEX);
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        const spy = spyOn(service, 'swapCards');
        service.move(Direction.LEFT);
        expect(spy).not.toHaveBeenCalled();
    });
    it('should call swapCards when moving left', () => {
        service.makeSelection(MOCK_CARD, MOCK_INDEX + 1);
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        const spy = spyOn(service, 'swapCards');
        service.move(Direction.LEFT);
        expect(spy).toHaveBeenCalled();
    });
    it('getCards should return cards asOboservabe', () => {
        const spy = spyOn(service.cards, 'asObservable');
        service.getCards();
        expect(spy).toHaveBeenCalled();
    });
    it(' has Cards should return true when cards has the card', () => {
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        expect(service.hasCard(MOCK_CARD)).toBeTrue();
    });
    it(' has Cards should return false when cards has the card', () => {
        service.cards.next([{ letter: 'B', point: 2 }]);
        expect(service.hasCard(MOCK_CARD)).toBeFalse();
    });
    it('addCard should card to the cards array', () => {
        service.cards.next([{ letter: 'B', point: 0 }]);
        service.addCard(MOCK_CARD);
        expect(service.hasCard(MOCK_CARD)).toBeTrue();
    });
    it('removeCard should remove the card from the array', () => {
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        service.removeCard(MOCK_CARD);
        expect(service.hasCard(MOCK_CARD)).toBeFalse();
    });
    it('should return undefined when card is not in the array', () => {
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        service.selectionIndex = 1;
        expect(service.findCard(MOCK_CARD.letter)).not.toBeUndefined();
    });
    it('findCard should return the card selected ', () => {
        service.cards.next([{ letter: 'B', point: 2 }, MOCK_CARD]);
        service.selectionIndex = 0;
        expect(service.findCard(MOCK_CARD.letter)).toBe(MOCK_CARD);
    });
    it('should return undefined when card is not in the array', () => {
        service.cards.next([{ letter: 'B', point: 2 }]);
        service.selectionIndex = 0;
        expect(service.findCard(MOCK_CARD.letter)).toBeUndefined();
    });
    it('should return undefined when card is not in the array', () => {
        service.cards.next([{ letter: 'B', point: 2 }]);
        service.selectionIndex = 0;
        expect(service.findCard(MOCK_CARD.letter)).toBeUndefined();
    });
    it('should call makeSelection when handleKeyboard', () => {
        const spy = spyOn(service, 'makeSelection');
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        service.handleKeyboard('A');
        expect(spy).toHaveBeenCalled();
    });
    it('should call reset when handleKeyboard is called with a letter that is not in the easel', () => {
        const spy = spyOn(service, 'reset');
        service.cards.next([MOCK_CARD, { letter: 'B', point: 2 }]);
        service.handleKeyboard('C');
        expect(spy).toHaveBeenCalled();
    });
});
