import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { Box } from '@app/classes/grid/box';
import { Grid } from '@app/classes/grid/grid';
import { AXIS, Placement } from '@app/classes/grid/placement';
import { BACKSPACE, ENTER, ESCAPE } from '@app/constants/command';
import { bankLetters } from '@app/constants/easel';
import { ALPHABET_REGEX, DEFAULT_PLACEMENT, LAST_ELEMENT, NORMALIZE_MODE, REMOVE_SYMBOLS_REGEX } from '@app/constants/grid';
import { CommandService } from '@app/services/command/command.service';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { GridDrawingService } from '@app/services/grid/grid-drawing/grid-drawing.service';
import { GridService } from '@app/services/grid/grid/grid.service';

@Injectable({
    providedIn: 'root',
})
export class GridManagerService {
    grid: Grid;
    placement: Placement;
    isFirst: boolean;

    constructor(
        private readonly gridService: GridService,
        private readonly easelService: EaselService,
        private readonly commandService: CommandService,
        private readonly gridDrawingService: GridDrawingService,
    ) {
        this.grid = Grid.getGrid();
        this.placement = DEFAULT_PLACEMENT;
        this.isFirst = true;
    }

    /**
     * gére les entréesdu clavier
     *
     * @param keyPressed la touche entrée par le joueur
     **/
    handleKeyPressed(keyPressed: string): void {
        switch (keyPressed) {
            case ENTER:
                this.handleEnter();
                break;

            case ESCAPE:
                this.handleEscape();
                break;

            case BACKSPACE:
                this.handleBackSpace();
                break;

            default:
                this.handleValid(keyPressed);
                break;
        }
    }

    /**
     * Exécuter quand on click Enter. Joue le placement
     */
    handleEnter(): void {
        this.commandService.place(this.placement);
        this.handleEscape();
    }

    /**
     * Exécuter quand on click BackSpace. Efface un charactère du placement
     */
    handleBackSpace(): void {
        if (this.isUpperCase(this.popLastCharacter(this.placement.value))) return;
        const box = this.gridService.getPreviousBox();

        this.popPlacementValue();
        this.gridService.resetSelectedBox();
        if (!box) return;
        const boxCopy = { ...box, y: box.x, x: box.y };
        this.gridDrawingService.clearBox(boxCopy);
        this.gridService.setSelectedBox({ x: box.x, y: box.y });
        if (this.placement.value === '') {
            this.gridService.resetSelectedBox();
            this.resetPlacement();
        }
    }
    /**
     * Gère la logique de la  touche ESCAPE, Réinitialise le placement
     */
    handleEscape() {
        // eslint-disable-next-line no-unused-vars
        for (const _ of this.placement.value) this.handleBackSpace();
        this.resetPlacement();
    }

    /**
     * Exécuter quand tape une lettre. Place la lettre sur le grid
     *
     * @param value du keyPressed
     */
    handleValid(value: string): void {
        const card = this.stringToCards(value);
        if (!this.easelService.hasCard(card)) return;
        if (this.isFirst) this.handleFirst();
        if (this.gridService.placeLetter(value)) this.appendPlacementValue(value);
    }

    /**
     * Remet le placement à un placement vide
     */
    resetPlacement(): void {
        this.placement = DEFAULT_PLACEMENT;
        this.isFirst = true;
        this.gridService.unlockDirection();
        this.gridService.reset();
    }

    /**
     * Check si la lettre est en majuscule. Retourne true si oui. false sinon
     *
     * @param value lettre a verifier
     * @returns
     */
    isUpperCase(value: string): boolean {
        if (!this.isAlphabetic(value)) return false;
        return value === value.toUpperCase();
    }
    /**
     * Indique si le caractère est une lettre
     *
     * @param value Caractère
     * @returns Booléen qui indique si le caractère est une lettre
     */

    isAlphabetic(value: string): boolean {
        return ALPHABET_REGEX.test(value);
    }
    /**
     * Supprime les symboles du mot
     *
     * @param word Le mot à traiter
     * @returns Mot sans les symboles
     */
    processSymbols(word: string): string {
        return word.normalize(NORMALIZE_MODE).replace(REMOVE_SYMBOLS_REGEX, '');
    }
    /**
     * converti un string vers un objet Letter
     *
     * @param value le string à convertir
     */
    stringToCards(value: string): Letter {
        if (this.isUpperCase(value)) return bankLetters.slice(LAST_ELEMENT)[0];
        return bankLetters.filter((card) => {
            return card.letter === value.toUpperCase();
        })[0];
    }

    /**
     * Exécuter si c'est la première letttre dans le placement
     */
    private handleFirst() {
        if (this.selectedBox) {
            this.placement.pos = { x: this.selectedBox.x, y: this.selectedBox.y };
            this.placement.direction = this.direction;
            this.isFirst = false;
            this.gridService.lockDirection();
        }
    }

    /**
     * Ajoute une lettre dans le placement et enleve la card correspondate du easel
     *
     * @param value lettre a ajouter au placement
     */
    private appendPlacementValue(value: string): void {
        this.placement.value += value;
        this.easelService.removeCard(this.stringToCards(value));
    }
    /**
     * enleve la dernière lettre du placement et ajoute la carde correspondante dans le easel
     *
     * @returns la lettre enlever
     */
    private popPlacementValue(): string {
        const element = this.popLastCharacter(this.placement.value);
        this.placement.value = this.placement.value.slice(0, LAST_ELEMENT);
        this.addToEasel(element);
        return element;
    }
    /**
     * Ajoute une cart au easel
     *
     * @param element a ajoute dans le easel
     */
    private addToEasel(element: string) {
        if (element !== '' && this.gridService.selectedBox) {
            this.easelService.addCard(this.stringToCards(element));
        }
    }

    /**
     * enleve la dernière lettre d'un string
     *
     * @param value le string duquel on vut enlever son dernier charactère
     * @returns le charactère enlever du string
     */
    private popLastCharacter(value: string): string {
        return value.charAt(value.length - 1);
    }

    get selectedBox(): Box | undefined {
        return this.gridService.selectedBox;
    }

    get direction(): AXIS {
        return this.gridService.direction;
    }
}
