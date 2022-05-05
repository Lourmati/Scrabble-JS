/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas/canvas-test-helper';
import { Grid } from '@app/classes/grid/grid';
import { AXIS } from '@app/classes/grid/placement';
import { FONT_CONSTANTS, GRID_CONSTANTS } from '@app/constants/grid';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';

const GRID_OFFSET = 50;

describe('GridService', () => {
    let service: GridDrawingService;
    let ctxStub: CanvasRenderingContext2D;
    let grid: Grid;
    const { defaultWidth, defaultHeight } = GRID_CONSTANTS;
    const { defaultFontSize, maxFontSize, minFontSize } = FONT_CONSTANTS;
    const CANVAS_WIDTH = window.innerHeight - GRID_OFFSET;
    const CANVAS_HEIGHT = window.innerHeight - GRID_OFFSET;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridDrawingService);
        grid = Grid.getGrid();
        grid.boxes = [...Grid.getGrid().boxes];
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
        service.setSize({ x: CANVAS_WIDTH, y: CANVAS_HEIGHT });
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });
    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_HEIGHT);
    });

    it(' setting width should set the width of the grid canvas', () => {
        const expectedHeight = defaultHeight;
        service.height = expectedHeight;
        expect(service.height).toEqual(expectedHeight);
    });
    it(' setting width should set the width of the grid canvas', () => {
        const expectedWidth = defaultWidth;
        service.width = expectedWidth;
        expect(service.width).toEqual(expectedWidth);
    });
    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x: number) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x: number) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
    it(' drawGrid should call drawIndicators', () => {
        const drawIndicatorsSpy = spyOn<any>(service, 'drawIndicators').and.callThrough();
        service.drawGrid();
        expect(drawIndicatorsSpy).toHaveBeenCalled();
    });
    it(' drawGrid should call drawRowsColumns', () => {
        const drawRowsColumnsSpy = spyOn<any>(service, 'drawRowsColumns').and.callThrough();
        service.drawGrid();
        expect(drawRowsColumnsSpy).toHaveBeenCalled();
    });
    it(' drawGrid should call drawImage', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spy = spyOn<any>(service, 'drawStar');
        service.drawGrid();
        expect(spy).toHaveBeenCalled();
    });
    it(' drawGrid should call gridContext.beginPath', () => {
        const beginPathSpy = spyOn(service.gridContext, 'beginPath').and.callThrough();
        const strokeSpy = spyOn(service.gridContext, 'stroke');
        service.drawGrid();
        expect(beginPathSpy).toHaveBeenCalled();
        expect(strokeSpy).toHaveBeenCalled();
    });
    it(' drawGrid should call fillText 255 times', () => {
        service.grid.boxes[8][8].value = ' ';
        const expectedCallTimes = 255;
        const fillTextSpy = spyOn<any>(service.gridContext, 'fillText').and.callThrough();
        service.drawGrid();
        expect(fillTextSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });
    it(' drawGrid should call fillText and rect 225 times', () => {
        const expectedCallTimes = 225;
        const fillRectSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        const rectSpy = spyOn(service.gridContext, 'rect').and.callThrough();
        service.drawGrid();
        expect(fillRectSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(rectSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });
    it(' updateFontSize should update font Size if the value is valid ', () => {
        const value = 1;
        service.updateFontSize(value);
        expect(service.fontSize).toEqual(defaultFontSize + value);
    });
    it(' updateFontSize should not update font Size if the maximum font size is reached ', () => {
        const value = 1;
        service.fontSize = maxFontSize;
        service.updateFontSize(value);
        expect(service.fontSize).toEqual(maxFontSize);
    });
    it(' updateFontSize should not update font Size if the minimum font size is reached ', () => {
        const value = -1;
        service.fontSize = minFontSize;
        service.updateFontSize(value);
        expect(service.fontSize).toEqual(minFontSize);
    });
    it('drawArrow should call fillText with Horizontal Direction', () => {
        const spy = spyOn(service.gridContext, 'fillText');
        service.drawArrow(grid.boxes[1][1], AXIS.Horizontal);
        expect(spy).toHaveBeenCalled();
    });
    it('drawArrow should call fillText with Vertical Direction', () => {
        const spy = spyOn(service.gridContext, 'fillText');
        service.drawArrow(grid.boxes[1][1], AXIS.Vertical);
        expect(spy).toHaveBeenCalled();
    });
    it('highlighted border should call strokeRect', () => {
        const spy = spyOn(service.gridContext, 'strokeRect');
        service.highlightedBorder(grid.boxes[1][1], true);
        expect(spy).toHaveBeenCalled();
    });
    it('highlighted border should call strokeRect with black if value is false', () => {
        service.highlightedBorder(grid.boxes[1][1], false);
        expect(service.gridContext.strokeStyle).toEqual('#000000');
    });
    it('highlighted border should call strokeRect with yellow if value is true', () => {
        service.highlightedBorder(grid.boxes[1][1], true);
        expect(service.gridContext.strokeStyle).toEqual('#ffff00');
    });
    it('DetectBoxPosition should return -1 if postition is invalid', () => {
        const expected = { x: -1, y: -1 };
        const res = service.detectBoxPosition({ x: 0, y: 0 });
        expect(res).toEqual(expected);
    });
    it('DetectBoxPosition should return 1 if postition is invalid', () => {
        const expected = { x: 0, y: 0 };
        const res = service.detectBoxPosition({ x: service.boxWidth, y: service.boxHeight });
        expect(res).toEqual(expected);
    });
    it(' updateFontSize should not update font Size if the minimum font size is reached ', () => {
        const value = -1;
        service.fontSize = minFontSize;
        service.updateFontSize(value);
        expect(service.fontSize).toEqual(minFontSize);
    });
});
