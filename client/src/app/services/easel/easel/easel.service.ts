import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { Direction } from '@app/classes/direction/direction';
import { CommandService } from '@app/services/command/command.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EaselService {
    exchange: Letter[];
    selection: BehaviorSubject<Letter | null>;
    onExchange: BehaviorSubject<boolean>;
    cards: BehaviorSubject<Letter[]>;
    removedCards: Map<string, number[]>;
    selectionIndex: number;

    constructor(private readonly commandService: CommandService) {
        this.cards = new BehaviorSubject<Letter[]>([]);
        this.exchange = [];
        this.selection = new BehaviorSubject<Letter | null>(null);
        this.onExchange = new BehaviorSubject<boolean>(false);
    }

    /**
     * Ajoute une lettre du chevalet au lettres en état d'échange
     *
     * @param card lettre à ajouter
     */
    addExchangeCard(card: Letter): void {
        this.exchange.push(card);
        this.onExchange.next(true);
    }

    /**
     * supprime une lettre des lettres en état d'échange
     *
     * @param card lettre a enlever
     */
    removeExchangeCard(card: Letter): void {
        this.exchange = this.exchange.filter((letter) => letter !== card);
        if (this.exchange.length === 0) this.onExchange.next(false);
    }

    /**
     * savoir si une lettre est sélectionnée pour manipulation
     *
     * @param card lettre en question
     * @param index l'index de la lettre dans le chevalet
     * @returns true si la lettre est déja selectionnée pour manipulation
     */
    isSelectionCard(card: Letter, index: number): boolean {
        return JSON.stringify(card) === JSON.stringify(this.selection.value) && index === this.selectionIndex;
    }

    /**
     *
     * @returns la lettre sélectionnée pour manipulation en observable
     */
    getSelection(): Observable<Letter | null> {
        return this.selection.asObservable();
    }

    /**
     * @returns true si il ya des lettres sélectionnées pour échange
     */
    getExchange(): Observable<boolean> {
        return this.onExchange.asObservable();
    }

    /**
     * @returns les lettres du chevalet en observable
     */
    getCards(): Observable<Letter[]> {
        return this.cards.asObservable();
    }

    /**
     * Sélectionne une lettre pour manipulation
     *
     * @param card lettre à sélectionner
     * @param selectionIndex index de la lettre
     */
    makeSelection(card: Letter, selectionIndex: number): void {
        this.selection.next(card);
        this.selectionIndex = selectionIndex;
    }

    /**
     * enlever l'état de selection pour manipulation
     */
    removeSelection(): void {
        this.selection.next(null);
        this.selectionIndex = -1;
    }

    /**
     * @returns true si il ya une lettre sélectionné pour manipulation
     */
    hasSelection(): boolean {
        return this.selection.value !== null;
    }

    /**
     *
     * @param card lettre du chevalet
     * @returns true si la lettre est sélectionnée pour échange
     */
    exchangeHasCard(card: Letter): boolean {
        return this.exchange.includes(card);
    }

    /**
     * réinitialise les selection du easel , cette méthode est utilisé par le gestionnaire d'évènements
     */
    reset(): void {
        this.exchange = [];
        this.removeSelection();
        this.onExchange.next(false);
    }

    /**
     * Échanger les lettres qui sont sélectionnées pour échange
     */
    exchangeLetters(): void {
        this.commandService.exchange(this.exchange);
    }

    /**
     * @param card lettre en question
     * @returns true si le chevalet contient la lettre
     */
    hasCard(card: Letter): boolean {
        return this.cards.value.some((letter) => letter.letter === card.letter);
    }

    /**
     * ajoute une lettre au chevalet
     *
     * @param card lettre a ajouter
     */
    addCard(card: Letter): void {
        const currentCards = this.cards.value;
        const updatedCards = [...currentCards, card];
        this.cards.next(updatedCards);
    }

    /**
     * supprime une lettre du chevalet,
     * cette méthode est utilisée lors des placement sur le grid
     *
     * @param card lettre à supprimer
     */
    removeCard(card: Letter): void {
        const cardIndex = this.cards.value.findIndex((letter) => letter.letter === card.letter);
        const currentCards = this.cards.value;
        currentCards.splice(cardIndex, 1);
        this.cards.next(currentCards);
    }

    /**
     * permet de déplacer la lettre sélectionné pour manipulation en la déplaçant selon la direction
     *
     * @param direction direction du déplacement (Gauche ou Droite)
     */
    move(direction: Direction): void {
        const nextSelectionIndex = direction === Direction.LEFT ? this.selectionIndex - 1 : this.selectionIndex + 1;
        if (this.selectionCanBeMoved(direction)) {
            this.swapCards(this.selectionIndex, direction);
            this.cards.next(this.cards.value);
            this.makeSelection(this.cards.value[nextSelectionIndex], nextSelectionIndex);
        } else this.swapAtBoundaries();
    }

    /**
     * permet de vérifier si la lettre sélectionnée pour manipulation
     * peut être déplacé selon la direction
     *
     * @param direction Direction du déplacement
     * @returns true si elle est pas sur les extrémités
     */
    selectionCanBeMoved(direction: Direction): boolean {
        if (direction === Direction.LEFT) return this.hasSelection() && !this.selectionIsAtFirstPosition();
        else return this.hasSelection() && !this.selectionIsAtBoundary();
    }

    /**
     *
     * @returns true si elle est a la dernier position du chevalet
     */
    selectionIsAtBoundary(): boolean {
        return this.selectionIndex === this.cards.value.length - 1;
    }

    /**
     *
     * @returns true si elle est a la premiere position du chevalet
     */
    selectionIsAtFirstPosition(): boolean {
        return this.selectionIndex === 0;
    }

    /**
     * swap la lettre selectionné pour manipulation et la lettre suivante
     *
     * @param selectionIndex index de la lettre selectionné pour manipulation
     * @param direction direction du déplacement
     */
    swapCards(selectionIndex: number, direction: Direction): void {
        const temp: Letter = this.cards.value[selectionIndex];
        const nextIndex = direction === Direction.LEFT ? selectionIndex - 1 : selectionIndex + 1;
        this.cards.value[selectionIndex] = this.cards.value[nextIndex];
        this.cards.value[nextIndex] = temp;
    }

    /**
     * swap les lettres des deux extrémités du chevalet
     */
    swapAtBoundaries(): void {
        const firstCard: Letter = this.cards.value[this.selectionIndex];
        const nextIndex = this.selectionIsAtBoundary() ? 0 : this.cards.value.length - 1;
        this.cards.value[this.selectionIndex] = this.cards.value[nextIndex];
        this.cards.value[nextIndex] = firstCard;
        this.makeSelection(firstCard, nextIndex);
    }

    /**
     * retrouver l'index d'Une lettre du chevalet
     *
     * @param letter lettre recherchée
     * @returns l'index de la lettre
     */
    findCardPosition(letter: string): number {
        return this.cards.value.findIndex((card, index) => letter === card.letter && !this.isSelectionCard(card, index));
    }

    /**
     * gére les entrées du clavier
     *
     * @param letterPressed touche pressée
     */
    handleKeyboard(letterPressed: string): void {
        const card: Letter | undefined = this.findCard(letterPressed);
        const cardIndex: number = this.findCardPosition(letterPressed);
        if (card) {
            this.removeSelection();
            this.makeSelection(card, cardIndex);
            this.selection.next(this.selection.value);
        } else this.reset();
    }

    /**
     * retrouve une lettre dans le chevalet
     *
     * @param letter lettre cherché
     * @returns la lettre en question
     */
    findCard(letter: string): Letter | undefined {
        return this.cards.value.find((card, index) => card.letter === letter && !this.isSelectionCard(card, index));
    }
}
