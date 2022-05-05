import { Component, HostListener } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { COMPONENT } from '@app/classes/control/component';
import { EaselManagerService } from '@app/services/easel/easel-manager/easel-manager.service';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GameDisplayService } from '@app/services/game-display/game-display.service';
import { GameService } from '@app/services/game/game.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
@Component({
    selector: 'app-easel',
    templateUrl: './easel.component.html',
    styleUrls: ['./easel.component.scss'],
})
export class EaselComponent {
    letters: Letter[];
    isCurrentController: boolean;
    isCurrentPlayer: boolean;

    constructor(
        private readonly gameDisplayService: GameDisplayService,
        private readonly easelService: EaselService,
        private readonly easelManager: EaselManagerService,
        private readonly keyboardHandler: KeyboardHandlerService,
        private readonly gameService: GameService,
    ) {
        this.isCurrentController = false;
        this.isCurrentPlayer = false;
        this.gameDisplayService.onUpdateEasel().subscribe(this.handleEaselUpdate.bind(this));
        this.easelService.getCards().subscribe(this.handleEaselChange.bind(this));
        this.keyboardHandler.getCurrentController().subscribe(this.handleControllerChange.bind(this));
        this.gameService.getCurrentPlayerObservable().subscribe(this.handlePlayerChange.bind(this));
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
        if (!this.isCurrentController) return;
        this.easelManager.handleKeyboardEvent(event.key);
    }

    @HostListener('wheel', ['$event'])
    onScroll(event: WheelEvent) {
        const key = this.isScrollDown(event) ? 'ArrowLeft' : 'ArrowRight';
        this.easelManager.handleKeyboardEvent(key);
    }

    handleEaselUpdate(letters: Letter[]): void {
        if (letters.length > 0) letters = letters.map((letter) => ({ letter: letter.letter.toUpperCase(), point: letter.point }));
        this.easelService.cards.next(letters);
        this.letters = this.easelService.cards.value;
    }

    handleEaselChange(): void {
        this.letters = this.easelService.cards.value;
    }

    handleComponentClick(event: MouseEvent): void {
        this.keyboardHandler.takeControl(COMPONENT.EASEL);
        event.stopPropagation();
    }

    handleControllerChange(component: COMPONENT): void {
        this.isCurrentController = component === COMPONENT.EASEL;
    }

    handlePlayerChange(isCurrentPlayer: boolean): void {
        this.isCurrentPlayer = isCurrentPlayer;
    }

    isScrollDown(event: WheelEvent): boolean {
        return event.deltaY > 0 && event.deltaX === 0;
    }
}
