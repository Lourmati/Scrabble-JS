import { Component } from '@angular/core';
import { FONT_SIZE_OFFSET } from '@app/constants/grid';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';

@Component({
    selector: 'app-control-panel',
    templateUrl: './control-panel.component.html',
    styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent {
    constructor(private readonly gridDrawingService: GridDrawingService) {}

    resizeBiggerFont(): void {
        this.resize(FONT_SIZE_OFFSET);
    }

    resizeSmallerFont(): void {
        this.resize(-FONT_SIZE_OFFSET);
    }

    resize(size: number): void {
        this.gridDrawingService.updateFontSize(size);
        this.gridDrawingService.drawGrid();
    }
}
