/* eslint-disable max-lines */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { Grid } from '@app/classes/grid/grid';
import { AXIS } from '@app/classes/grid/placement';
import { Multiplier, MULTIPLIERS_COLORS } from '@app/constants/grid';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { GridService } from '@app/services/grid/grid/grid.service';
import SpyObj = jasmine.SpyObj;

describe('GridService', () => {
    let service: GridService;
    let grid: Grid;
    let gridDrawingService: SpyObj<GridDrawingService>;

    beforeEach(() => {
        grid = Grid.getGrid();
        grid.boxes = [...Grid.getGrid().boxes];
        gridDrawingService = jasmine.createSpyObj('GridDrawingService', [
            'clearBox',
            'highlightedBorder',
            'detectBoxPosition',
            'drawBoxContent',
            'drawArrow',
        ]);
        TestBed.configureTestingModule({ providers: [{ provide: GridDrawingService, useValue: gridDrawingService }] });
        service = TestBed.inject(GridService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' updateGrid should call drawGrid', () => {
        const updateGridSpy = spyOn<any>(service, 'updateGrid').and.callThrough();
        service.updateGrid(grid);
        expect(updateGridSpy).toHaveBeenCalled();
    });
    it(' setSelectedBox should set the selected box with valid pos ', () => {
        const expectedPos = { x: 10, y: 10 };
        service.selectedBox = grid.boxes[1][1];
        expect(service.selectedBox).toEqual(grid.boxes[1][1]);
        service.setSelectedBox(expectedPos);
        expect(service.selectedBox).toEqual(grid.boxes[10][10]);
    });
    it(' setSelectedBox should set the selected box with invalid pos ', () => {
        service.selectedBox = grid.boxes[1][1];
        service.setSelectedBox({ x: 0, y: 0 });
        expect(service.selectedBox).toEqual(grid.boxes[0][0]);
    });
    it('Should make box unselected(undefined)', () => {
        gridDrawingService.highlightedBorder.and.stub();
        service.selectedBox = grid.boxes[1][1];
        service.unSelectBox();
        expect(service.selectedBox).toBeFalsy();
    });
    it('ToggleDirection should toggle the direction if direction is Vertical ', () => {
        service.direction = AXIS.Vertical;
        service.toggleDirection();
        expect(service.direction).toBe(AXIS.Horizontal);
    });
    it('ToggleDirection should toggle the direction if direction is Horizontal ', () => {
        service.direction = AXIS.Horizontal;
        service.toggleDirection();
        expect(service.direction).toBe(AXIS.Vertical);
    });
    it('ToggleDirection should return if direction not locked ', () => {
        service.lockedDiretion = true;
        service.direction = AXIS.Horizontal;
        service.toggleDirection();
        expect(service.direction).toEqual(AXIS.Horizontal);
    });
    it('Reset should unSelectBox', () => {
        service.selectedBox = grid.boxes[1][1];
        const spy = spyOn(service, 'unSelectBox');
        service.reset();
        expect(spy).toHaveBeenCalled();
    });
    it('Reset should make direction horizontal', () => {
        service.direction = AXIS.Vertical;
        service.reset();
        expect(service.direction).toEqual(AXIS.Horizontal);
    });
    it('resetSelectedBox should make box value empty', () => {
        const box = grid.boxes[1][1];
        service.selectedBox = box;
        service.selectedBox.value = 'R';
        service.resetSelectedBox();
        expect(box.value).toBe('');
    });

    it('getPreviousBox should be undefined is selectedBox is undefined', () => {
        service.selectedBox = undefined;
        expect(service.getPreviousBox()).toBe(undefined);
    });

    it('getPreviousBox should be selectBox', () => {
        service.selectedBox = {
            x: 1,
            y: 1,
            value: 'string',
            index: 1,
            multiplier: Multiplier.Basic,
            color: 'string',
            available: true,
        };
        service.direction = AXIS.Horizontal;
        expect(service.getPreviousBox()).toBe(service.selectedBox);
    });

    it('getPreviousBox should be selectedBox', () => {
        service.selectedBox = {
            x: 1,
            y: 1,
            value: 'string',
            index: 1,
            multiplier: Multiplier.Basic,
            color: 'string',
            available: true,
        };
        service.direction = AXIS.Vertical;
        expect(service.getPreviousBox()).toBe(service.selectedBox);
    });

    it('getNextBox should be undefined', () => {
        service.selectedBox = {
            x: 15,
            y: 1,
            value: 'string',
            index: 1,
            multiplier: Multiplier.Basic,
            color: 'string',
            available: true,
        };
        service.direction = AXIS.Horizontal;
        expect(service.getNextBox()).toBe(undefined);
    });

    it('getNextBox should be undefined ', () => {
        service.selectedBox = {
            x: 1,
            y: 15,
            value: 'string',
            index: 1,
            multiplier: Multiplier.Basic,
            color: 'string',
            available: true,
        };
        service.direction = AXIS.Vertical;
        expect(service.getNextBox()).toBe(undefined);
    });

    it('isSelectedBox should return true with valid value', () => {
        const box = grid.boxes[1][1];
        service.selectedBox = box;
        expect(service.isSelectedBox(box)).toBeTrue();
    });
    it('isSelectedBox should return false with valid not value', () => {
        const box = grid.boxes[1][1];
        service.selectedBox = box;
        expect(service.isSelectedBox(grid.boxes[2][2])).toBeFalse();
    });
    it('resetSelectedBox not execute', () => {
        service.selectedBox = undefined;
        service.resetSelectedBox();
        const spy = spyOn(service, 'unSelectBox');
        expect(spy).not.toHaveBeenCalled();
    });
    it('resetSelectedBox should reset the color of the box', () => {
        service.selectedBox = grid.boxes[1][2];
        service.selectedBox.color = MULTIPLIERS_COLORS.letterX3;
        service.resetSelectedBox();
        expect(grid.boxes[1][2].color).toBe(MULTIPLIERS_COLORS.white);
    });
    it('resetSelectedBox should reset the color of the box', () => {
        service.selectedBox = grid.boxes[1][1];
        service.selectedBox.color = MULTIPLIERS_COLORS.letterX2;
        service.resetSelectedBox();
        expect(grid.boxes[1][2].color).toBe(MULTIPLIERS_COLORS.white);
    });
    it('resetSelectedBox should reset the color of the box', () => {
        service.selectedBox = grid.boxes[1][2];
        service.selectedBox.color = MULTIPLIERS_COLORS.wordX2;
        service.resetSelectedBox();
        expect(grid.boxes[1][2].color).toBe(MULTIPLIERS_COLORS.white);
    });
    it('resetSelectedBox should call assign Color method', () => {
        gridDrawingService.highlightedBorder.and.stub();
        const spy = spyOn<any>(service, 'assignColor');
        service.selectedBox = grid.boxes[1][1];
        service.resetSelectedBox();
        expect(spy).toHaveBeenCalled();
    });
    it('lockDirection should set lockedDirction to true', () => {
        service.lockedDiretion = true;
        service.lockDirection();
        expect(service.lockedDiretion).toBeTrue();
    });
    it('unlockDirection should set lockedDirction to false', () => {
        service.lockedDiretion = false;
        service.unlockDirection();
        expect(service.lockedDiretion).toBeFalse();
    });
    it('SelectBox should call boxIsInvalid', () => {
        gridDrawingService.detectBoxPosition.and.returnValue({ x: 1, y: 1 });
        const spy = spyOn<any>(service, 'boxIsInvalid');
        service.selectBox({ x: 1, y: 1 });
        expect(spy).toHaveBeenCalled();
    });
    it('boxIsInvalid should return true if isCurrentPlayer or lockeedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        service.isCurrentPlayer = false;
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });
    it('boxIsInvalid should return true if box has value', () => {
        const box = Grid.getGrid().boxes[1][1];
        service.isCurrentPlayer = true;
        Grid.getGrid().boxes[1][1].value = 'dummy';
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });
    it('boxIsInvalid should return false if box is valid', () => {
        const box = Grid.getGrid().boxes[3][3];
        service.isCurrentPlayer = true;
        Grid.getGrid().boxes[3][3].value = '';
        expect(service['boxIsInvalid'](box)).toBeFalse();
    });

    it('boxIsInvalid should return true if isCurrentPlayer or lockedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        box.available = false;
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });

    it('boxIsInvalid should return true if isCurrentPlayer or lockedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        box.available = true;
        service.lockedDiretion = true;
        service.isCurrentPlayer = true;
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });

    it('boxIsInvalid should return true if isCurrentPlayer or lockedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        box.available = true;
        service.lockedDiretion = false;
        service.isCurrentPlayer = false;
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });

    it('boxIsInvalid should return true if isCurrentPlayer or lockedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        box.available = true;
        box.value = 'a';
        service.lockedDiretion = false;
        service.isCurrentPlayer = true;
        expect(service['boxIsInvalid'](box)).toBeTruthy();
    });

    it('boxIsInvalid should return true if isCurrentPlayer or lockedDirection', () => {
        const box = Grid.getGrid().boxes[1][1];
        box.available = true;
        box.value = '';
        service.lockedDiretion = false;
        service.isCurrentPlayer = true;
        const spy = spyOn<any>(service, 'posOutOfBounds').and.returnValue(true);
        expect(service['boxIsInvalid'](box)).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('handleCurrentSelected should call gridService methods', () => {
        const spy = spyOn(service, 'toggleDirection');
        service['handleCurrentSelected'](Grid.getGrid().boxes[1][1]);
        expect(spy).toHaveBeenCalled();
    });
    it('handleCurrentSelected should call gridService methods', () => {
        service['handleCurrentSelected'](Grid.getGrid().boxes[1][1]);
        expect(gridDrawingService.clearBox).toHaveBeenCalled();
    });
    it('handleCurrentSelected should call gridService methods', () => {
        service['handleCurrentSelected'](Grid.getGrid().boxes[1][1]);
        expect(gridDrawingService.drawArrow).toHaveBeenCalled();
    });
    it('handleCurrentSelected should call gridService methods', () => {
        service['handleCurrentSelected'](Grid.getGrid().boxes[1][1]);
        expect(gridDrawingService.highlightedBorder).toHaveBeenCalled();
    });
    it('posOutOfBounds should return false is pos is positive', () => {
        expect(service['posOutOfBounds']({ x: 2, y: 3 })).toBeFalsy();
    });
    it('selectBox should call getBoxFromPos Selected if the not same box is being selected', () => {
        const box = Grid.getGrid().boxes[1][1];
        const spy = spyOn<any>(service, 'getBoxFromPos').and.returnValue(box);
        service.selectedBox = box;
        service.selectBox({ x: 0, y: 0 });
        expect(spy).toHaveBeenCalled();
        expect(service.selectedBox).toEqual(box);
    });
    it('selectBox should call handleCurrentSelected Selected if the  same box is being selected', () => {
        const box = Grid.getGrid().boxes[1][1];
        gridDrawingService.detectBoxPosition.and.returnValue({ x: 1, y: 1 });
        spyOn<any>(service, 'boxIsInvalid').and.returnValue(false);
        spyOn<any>(service, 'isSelectedBox').and.returnValue(true);
        const spy = spyOn<any>(service, 'handleCurrentSelected');
        service.selectedBox = box;
        service.selectBox({ x: 1, y: 1 });
        expect(spy).toHaveBeenCalled();
        expect(service.selectedBox).toEqual(box);
    });
    it('selectBox should call unSelected if the not same box is being selected', () => {
        const box = Grid.getGrid().boxes[1][1];
        gridDrawingService.detectBoxPosition.and.returnValue({ x: 1, y: 1 });
        spyOn<any>(service, 'boxIsInvalid').and.returnValue(false);
        spyOn<any>(service, 'isSelectedBox').and.returnValue(false);
        service.selectedBox = box;
        const spy = spyOn<any>(service, 'unSelectBox');
        service.selectBox({ x: 1, y: 1 });
        expect(spy).toHaveBeenCalled();
    });
    it('placeLettre should return false if a box is not seelected', () => {
        service.selectedBox = undefined;
        expect(service.placeLetter('l')).toBeFalse();
    });
    it('placeLettre should change the value of a selectedBox', () => {
        const box = Grid.getGrid().boxes[1][1];
        service.selectedBox = box;
        spyOn<any>(service, 'getNextBox').and.returnValue(undefined);
        service.placeLetter('l');
        expect(box.value).toEqual('l');
    });
    it('placeLettre should check the getNextBox', () => {
        const box = Grid.getGrid().boxes[1][1];
        spyOn(service, 'getNextBox').and.returnValue(box);
        service.selectedBox = box;
        service.placeLetter('l');
        expect(gridDrawingService.clearBox).toHaveBeenCalled();
    });
    it('placeLettre should call unSelectBox', () => {
        const box = Grid.getGrid().boxes[1][1];
        service.selectedBox = box;
        spyOn<any>(service, 'getNextBox').and.returnValue(undefined);
        const spy = spyOn<any>(service, 'unSelectBox');
        service.placeLetter('l');
        expect(spy).toHaveBeenCalled();
    });
    it('posOutOfBounds shoould call unselectBox', () => {
        const pos = { x: -1, y: -1 };
        const spy = spyOn<any>(service, 'unSelectBox');
        service['posOutOfBounds'](pos);
        expect(spy).toHaveBeenCalled();
    });
    it('posOutOfBounds should return true when pos is invalid', () => {
        const pos = { x: -1, y: -1 };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        spyOn<any>(service, 'unSelectBox').and.callFake(() => {});
        expect(service['posOutOfBounds'](pos)).toBeTrue();
    });
    it('assignColor should change the box color to letterx3', () => {
        const box = Grid.getGrid().boxes[7][9];
        box.multiplier = Multiplier.LetterX3;
        service['assignColor'](box);
        expect(box.color).toBe(MULTIPLIERS_COLORS.letterX3);
    });
    it('assignColor should change the box color to wordx2', () => {
        const box = Grid.getGrid().boxes[6][8];
        box.color = MULTIPLIERS_COLORS.white;
        service['assignColor'](box);
        expect(box.color).toBe(MULTIPLIERS_COLORS.white);
    });
    it('getNextBox should return the next selectebox', () => {
        service.selectedBox = service.grid.boxes[1][1];
        const expectd = service.grid.boxes[2][1];
        expect(service.getNextBox()).toEqual(expectd);
    });
    it('getPreviousBox should return the previous selectebox', () => {
        service.selectedBox = service.grid.boxes[2][2];
        const expectd = service.grid.boxes[1][2];
        expect(service.getPreviousBox()).toEqual(expectd);
    });
    it('getNextBox should return the next selectebox with vertical direction', () => {
        service.direction = AXIS.Vertical;
        service.selectedBox = service.grid.boxes[2][2];
        const expectd = service.grid.boxes[2][3];
        expect(service.getNextBox()).toEqual(expectd);
    });
    it('getPreviousBox should return the previous selectebox with vertical direction', () => {
        service.direction = AXIS.Vertical;
        service.selectedBox = service.grid.boxes[2][2];
        const expectd = service.grid.boxes[2][1];
        expect(service.getPreviousBox()).toEqual(expectd);
    });
    it('getNextBox should return return undefined', () => {
        service.selectedBox = undefined;
        const expectd = undefined;
        expect(service.getNextBox()).toEqual(expectd);
    });
    it('assignColor should change the box color to letterx2', () => {
        const box = Grid.getGrid().boxes[7][7];
        box.color = Multiplier.LetterX2;
        service['assignColor'](box);
        expect(box.color).toBe(MULTIPLIERS_COLORS.letterX2);
    });
    it('assignColor should change the box color to wordX2', () => {
        const box = Grid.getGrid().boxes[14][14];
        box.multiplier = Multiplier.WordX2;
        service['assignColor'](box);
        expect(box.color).toBe(MULTIPLIERS_COLORS.wordX2);
    });
});
