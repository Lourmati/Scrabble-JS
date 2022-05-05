import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/grid/vec2';
import { MouseButton } from '@app/constants/grid';
import { DEFAULT_MOUSE_POSITION } from '@app/constants/mouse';
import { GridService } from '@app/services/grid/grid/grid.service';

@Injectable({
    providedIn: 'root',
})
export class MouseService {
    mousePosition: Vec2;

    constructor(private readonly gridService: GridService) {
        this.mousePosition = DEFAULT_MOUSE_POSITION;
    }

    /**
     * Gère les événements de la souris
     *
     * @param event Événement de souris
     */
    mouseHitDetect(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            this.gridService.selectBox(this.mousePosition);
        }
    }
}
