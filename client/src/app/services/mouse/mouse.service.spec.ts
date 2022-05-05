import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/grid/vec2';
import { GridService } from '@app/services/grid/grid/grid.service';
import { MouseService } from '@app/services/mouse/mouse.service';
import SpyObj = jasmine.SpyObj;

describe('MouseService', () => {
    let service: MouseService;
    let mouseEvent: MouseEvent;
    let gridService: SpyObj<GridService>;
    beforeEach(() => {
        gridService = jasmine.createSpyObj('GridService', ['selectBox']);
        TestBed.configureTestingModule({ providers: [{ provide: GridService, useValue: gridService }] });
        service = TestBed.inject(MouseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
        const expectedPosition: Vec2 = { x: 100, y: 200 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.mousePosition).toEqual(expectedPosition);
    });

    /* eslint-disable @typescript-eslint/no-magic-numbers -- Add reason */
    it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        mouseEvent = {
            offsetX: expectedPosition.x + 10,
            offsetY: expectedPosition.y + 10,
            button: 1,
        } as MouseEvent;
        service.mouseHitDetect(mouseEvent);
        expect(service.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(service.mousePosition).toEqual(expectedPosition);
    });
});
