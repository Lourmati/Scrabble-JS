/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Grid } from '@app/classes/grid/grid';
import { AXIS } from '@app/classes/grid/placement';
import { BACKSPACE, ENTER, ESCAPE } from '@app/constants/command';
import { bankLetters } from '@app/constants/easel';
import { DEFAULT_PLACEMENT } from '@app/constants/grid';
import { CommandService } from '@app/services/command/command.service';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { GridService } from '@app/services/grid/grid/grid.service';
import SpyObj = jasmine.SpyObj;

describe('GridManagerService', () => {
    let service: GridManagerService;
    let gridServiceSpy: SpyObj<GridService>;
    let easelServiceSpy: SpyObj<EaselService>;
    let commandServiceSpy: SpyObj<CommandService>;
    let gridDrawingService: SpyObj<GridDrawingService>;

    beforeEach(() => {
        commandServiceSpy = jasmine.createSpyObj('CommadService', ['place']);
        easelServiceSpy = jasmine.createSpyObj('EaselService', ['hasCard', 'addCard', 'removeCard']);
        easelServiceSpy.hasCard.and.returnValue(true);
        gridServiceSpy = jasmine.createSpyObj('GridService', [
            'resetSelectedBox',
            'placeLetter',
            'unSelectBox',
            'getPreviousBox',
            'selectedBox',
            'unlockDirection',
            'lockDirection',
            'reset',
            'setSelectedBox',
            'toggleDirection',
        ]);
        gridDrawingService = jasmine.createSpyObj('GridDrawingService', ['clearBox']);
        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: GridDrawingService, useValue: gridDrawingService },
                { provide: CommandService, useValue: commandServiceSpy },
                { provide: EaselService, useValue: easelServiceSpy },
            ],
        });
        service = TestBed.inject(GridManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('handleKeyPressed should call handleEnter with Enter key', () => {
        const spy = spyOn(service, 'handleEnter');
        service.handleKeyPressed(ENTER);
        expect(spy).toHaveBeenCalled();
    });
    it('handleKeyPressed should call handleEscape with Escape value', () => {
        const spy = spyOn(service, 'handleEscape');
        service.handleKeyPressed(ESCAPE);
        expect(spy).toHaveBeenCalled();
    });
    it('handleKeyPressed should call handleBackSpace with BackSpace value', () => {
        const spy = spyOn(service, 'handleBackSpace');
        service.handleKeyPressed(BACKSPACE);
        expect(spy).toHaveBeenCalled();
    });
    it('handleKeyPressed should call handleValid with valid value', () => {
        const spy = spyOn(service, 'handleValid');
        service.handleKeyPressed('a');
        expect(spy).toHaveBeenCalled();
    });
    it('isUpperCase should return true with R as a value', () => {
        const value = 'R';
        expect(service.isUpperCase(value)).toBe(true);
    });
    it('isUpperCase should return false with r as a value', () => {
        const value = 'r';
        expect(service.isUpperCase(value)).toBe(false);
    });
    it('isUpperCase should return false if value is not alphabetic, like 1', () => {
        const value = '1';
        expect(service.isUpperCase(value)).toBe(false);
    });
    it('processSymbol should return e if input is é', () => {
        const expected = 'e';
        const value = 'é';
        expect(service.processSymbols(value)).toEqual(expected);
    });
    it('processSymbol should return 1 if input is 1', () => {
        const expected = '1';
        const value = '1';
        expect(service.processSymbols(value)).toEqual(expected);
    });
    it('isAlphabetic should return true for A', () => {
        expect(service.isAlphabetic('A')).toBeTruthy();
    });
    it('isAlphabetic should return false for 1', () => {
        expect(service.isAlphabetic('1')).toBeFalsy();
    });
    it('handleKeyPressed should call gridService.placeLetter with Valid value');

    it('handleBackSpace should call gridService resetSelectedBox', () => {
        service.placement.value = 'placement';
        service.handleBackSpace();
        expect(gridServiceSpy.resetSelectedBox).toHaveBeenCalled();
    });

    it('handleBackSpace should call gridService unSelectBox', () => {
        service.handleBackSpace();
        expect(gridServiceSpy.unSelectBox).not.toHaveBeenCalled();
    });
    it('string to Letter should take a as value and return the A Card', () => {
        const expected = bankLetters[0];
        expect(service.stringToCards('a')).toEqual(expected);
    });
    it('string to Letter should take A as value and return the * Card', () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        const expected = bankLetters.slice(-1)[0];
        expect(service.stringToCards('A')).toEqual(expected);
    });
    it('string to Letter should take b as value and return the B Card', () => {
        const expected = bankLetters[1];
        expect(service.stringToCards('b')).toEqual(expected);
    });
    it('getSelectedBox should return the selected box', () => {
        gridServiceSpy.selectedBox = undefined;
        expect(service.selectedBox).toBe(undefined);
    });
    it('handleEnter should call Command Service', () => {
        service.handleEnter();
        expect(commandServiceSpy.place).toHaveBeenCalled();
    });
    it('handleValid should call stringToCards', () => {
        const spy = spyOn(service, 'stringToCards');
        service.handleValid('r');
        expect(spy).toHaveBeenCalled();
    });
    it('handleBackSpace should call resetPlacement with empty placement value', () => {
        gridServiceSpy.getPreviousBox.and.returnValue(Grid.getGrid().boxes[1][1]);
        service.placement.value = '';
        const spy = spyOn(service, 'resetPlacement');
        service.handleBackSpace();
        expect(spy).toHaveBeenCalled();
    });
    it('handleBackSpace should NOT call resetPlacement with NOT empty placement value', () => {
        gridServiceSpy.getPreviousBox.and.returnValue(Grid.getGrid().boxes[1][1]);
        service.placement.value = 'test';
        const spy = spyOn(service, 'resetPlacement');
        service.handleBackSpace();
        expect(spy).not.toHaveBeenCalled();
    });

    it('appendPlacementValue should add a char to the placement.value', () => {
        service.placement.value = 'te';
        service['appendPlacementValue']('st');
        expect(service.placement.value).toBe('test');
    });
    it('handleEnter should reset the placement', () => {
        const spy = spyOn(service, 'resetPlacement');
        service.handleEnter();
        expect(spy).toHaveBeenCalled();
    });
    it('resetPlacement should sould make the placement equal to default', () => {
        service.resetPlacement();
        expect(service.placement).toEqual(DEFAULT_PLACEMENT);
    });
    it('resetPlacement should sould make isFirst equal to true', () => {
        service.resetPlacement();
        expect(service.isFirst).toBeTruthy();
    });
    it('resetPlacement should sould call unlockDirection from gridService', () => {
        service.resetPlacement();
        expect(gridServiceSpy.unlockDirection).toHaveBeenCalled();
    });
    it('resetPlacement should sould call reset from gridService', () => {
        service.resetPlacement();
        expect(gridServiceSpy.reset).toHaveBeenCalled();
    });
    it('handleFirst should set placement postion', () => {
        const expected = { x: 1, y: 1 };
        gridServiceSpy.selectedBox = Grid.getGrid().boxes[1][1];
        service['handleFirst']();
        expect(service.placement.pos).toEqual(expected);
    });
    it('handleFirst should set the direction postion', () => {
        gridServiceSpy.direction = AXIS.Vertical;
        service['handleFirst']();
        expect(service.placement.direction).toEqual(AXIS.Vertical);
    });
    it('handleFirst should set isFirst to false', () => {
        service.isFirst = true;
        service['handleFirst']();
        expect(service.isFirst).toEqual(false);
    });
    it('handleEscapee should call handleBackSpace placement.value.lenght times', () => {
        service.placement.value = 'placement';
        service.placement.pos = { x: 8, y: 8 };
        const spy = spyOn(service, 'handleBackSpace');
        service.handleEscape();
        expect(spy).toHaveBeenCalled();
    });

    it('handleEscape should return', () => {
        service.placement.value = 'A';
        service.handleEscape();
        expect(gridServiceSpy.getPreviousBox).not.toHaveBeenCalled();
    });

    it('handleValid', () => {
        easelServiceSpy.hasCard.and.returnValue(true);
        service.isFirst = true;
        const spy = spyOn(service, 'handleFirst' as any);
        service.handleValid('a');
        expect(spy).toHaveBeenCalled();
    });

    it('handleValid', () => {
        easelServiceSpy.hasCard.and.returnValue(true);
        service.isFirst = false;
        const spy = spyOn(service, 'handleFirst' as any);
        service.handleValid('a');
        expect(spy).not.toHaveBeenCalled();
    });

    it('handleValid', () => {
        easelServiceSpy.hasCard.and.returnValue(false);
        service.isFirst = true;
        const spy = spyOn(service, 'handleFirst' as any);
        service.handleValid('a');
        expect(spy).not.toHaveBeenCalled();
    });

    it('handleValid', () => {
        easelServiceSpy.hasCard.and.returnValue(true);
        gridServiceSpy.placeLetter.and.returnValue(true);
        service.isFirst = true;
        const spy = spyOn(service, 'appendPlacementValue' as any);
        service.handleValid('a');
        expect(spy).toHaveBeenCalled();
    });

    it('handleFirst', () => {
        gridServiceSpy['selectedBox'] = undefined;
        service['handleFirst']();
        expect(gridServiceSpy.lockDirection).not.toHaveBeenCalled();
    });
});
