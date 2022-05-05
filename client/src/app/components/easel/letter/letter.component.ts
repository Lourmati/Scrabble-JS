import { Component, Input } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { COLORS } from '@app/constants/easel';
import { EaselService } from '@app/services/easel/easel/easel.service';

@Component({
    selector: 'app-letter',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.scss'],
})
export class LetterComponent {
    @Input() card: Letter;
    @Input() index: number;
    borderColor: string;

    constructor(private readonly easelService: EaselService) {
        this.borderColor = COLORS.black;
        this.easelService.getSelection().subscribe(this.updateBorderColor.bind(this));
    }

    isSelectionCard(): boolean {
        return this.easelService.isSelectionCard(this.card, this.index);
    }

    isExchangeCard(): boolean {
        return this.easelService.exchangeHasCard(this.card);
    }

    handleLeftClick(): void {
        if (!this.isExchangeCard()) {
            this.easelService.removeSelection();
            this.easelService.removeExchangeCard(this.card);
            this.easelService.makeSelection(this.card, this.index);
            this.updateBorderColor();
        }
    }

    handleRightClick(): void {
        if (this.isExchangeCard()) {
            this.easelService.removeExchangeCard(this.card);
        } else {
            this.easelService.removeSelection();
            this.easelService.addExchangeCard(this.card);
        }

        this.updateBorderColor();
    }

    updateBorderColor(): void {
        if (this.isSelectionCard()) {
            this.borderColor = COLORS.selection;
            return;
        }
        if (this.isExchangeCard()) {
            this.borderColor = COLORS.exchange;
            return;
        }
        this.borderColor = COLORS.black;
    }
}
