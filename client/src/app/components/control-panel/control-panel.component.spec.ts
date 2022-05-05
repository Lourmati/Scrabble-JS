import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { ControlPanelComponent } from './control-panel.component';
import SpyObj = jasmine.SpyObj;

describe('ControlPanelComponent', () => {
    let component: ControlPanelComponent;
    let fixture: ComponentFixture<ControlPanelComponent>;
    let gridDrawingService: SpyObj<GridDrawingService>;

    beforeEach(async () => {
        gridDrawingService = jasmine.createSpyObj('GridDrawingService', ['drawGrid', 'updateFontSize']);

        await TestBed.configureTestingModule({
            declarations: [ControlPanelComponent],
            providers: [{ provide: GridDrawingService, useValue: gridDrawingService }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ControlPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('resizeBiggerFont should update gridFont Size', () => {
        component.resizeBiggerFont();
        expect(gridDrawingService.drawGrid).toHaveBeenCalled();
    });
    it('resizeBiggerFont should call draw ', () => {
        component.resizeBiggerFont();
        expect(gridDrawingService.drawGrid).toHaveBeenCalled();
    });
    it('resizeSmallerFont should update gridFont Size', () => {
        component.resizeSmallerFont();
        expect(gridDrawingService.updateFontSize).toHaveBeenCalled();
    });
    it('resizeSmallerFont should call draw ', () => {
        component.resizeSmallerFont();
        expect(gridDrawingService.drawGrid).toHaveBeenCalled();
    });
});
