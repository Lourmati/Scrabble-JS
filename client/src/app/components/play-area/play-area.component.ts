import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { COMPONENT } from '@app/classes/control/component';
import { Grid } from '@app/classes/grid/grid';
import { GameDisplayService } from '@app/services/game-display/game-display.service';
import { GameService } from '@app/services/game/game.service';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { GridManagerService } from '@app/services/grid/grid-manager/grid-manager.service';
import { GridService } from '@app/services/grid/grid/grid.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
import { MouseService } from '@app/services/mouse/mouse.service';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;
    buttonPressed = '';
    isCurrentController: boolean = false;
    isCurrentPlayer: boolean = false;

    constructor(
        private readonly gridService: GridService,
        private readonly gameDisplayService: GameDisplayService,
        private readonly mouseService: MouseService,
        private readonly gridManagerService: GridManagerService,
        private readonly keyboardHandler: KeyboardHandlerService,
        private readonly gameService: GameService,
        private readonly gridDrawingService: GridDrawingService,
    ) {
        this.keyboardHandler.getCurrentController().subscribe(this.handleControllerChange.bind(this));
        this.gameService.getCurrentPlayerObservable().subscribe(this.handlePlayerChange.bind(this));
    }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent): void {
        if (!this.isCurrentController || !this.isCurrentPlayer) return;
        this.buttonPressed = event.key;
        this.gridManagerService.handleKeyPressed(this.buttonPressed);
    }

    ngAfterViewInit(): void {
        const width = this.gridCanvas.nativeElement.parentElement?.clientHeight || 0;
        this.gridCanvas.nativeElement.width = width;
        this.gridCanvas.nativeElement.height = width;
        this.gridDrawingService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridDrawingService.setSize({ x: width, y: width });
        this.gridCanvas.nativeElement.focus();
        this.subscribe();
    }

    subscribe(): void {
        this.gameDisplayService.onUpdateGrid().subscribe((grid: Grid) => {
            this.gridService.updateGrid(grid);
            this.gridDrawingService.drawGrid();
        });
    }

    mouseHitDetect(event: MouseEvent) {
        this.keyboardHandler.takeControl(COMPONENT.GRID);
        this.mouseService.mouseHitDetect(event);
        event.stopPropagation();
    }

    handleControllerChange(component: COMPONENT): void {
        this.isCurrentController = component === COMPONENT.GRID;
    }

    handlePlayerChange(isCurrentPlayer: boolean): void {
        this.isCurrentPlayer = isCurrentPlayer;
        this.gridService.isCurrentPlayer = isCurrentPlayer;
    }

    get width(): number {
        return this.gridDrawingService.width;
    }

    get height(): number {
        return this.gridDrawingService.height;
    }
}
