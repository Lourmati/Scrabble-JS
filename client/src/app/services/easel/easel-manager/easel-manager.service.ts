import { Injectable } from '@angular/core';
import { Direction } from '@app/classes/direction/direction';
import { KEY_LEFT, KEY_RIGHT } from '@app/constants/easel';
import { EaselService } from '@app/services/easel/easel/easel.service';
@Injectable({
    providedIn: 'root',
})
export class EaselManagerService {
    constructor(private readonly easelService: EaselService) {}

    /**
     * Gère les évènements de clavier pour le chevalet
     */
    handleKeyboardEvent(key: string): void {
        switch (key) {
            case KEY_LEFT:
                this.easelService.move(Direction.LEFT);
                break;
            case KEY_RIGHT:
                this.easelService.move(Direction.RIGHT);
                break;
            default:
                this.easelService.handleKeyboard(key);
        }
    }
}
