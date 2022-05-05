import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EaselService } from '@app/services/easel/easel/easel.service';
import { Observable } from 'rxjs';
import { LetterComponent } from './letter.component';
import SpyObj = jasmine.SpyObj;

describe('LetterComponent', () => {
    let component: LetterComponent;
    let fixture: ComponentFixture<LetterComponent>;
    let easelServiceSpy: SpyObj<EaselService>;

    beforeEach(async () => {
        easelServiceSpy = jasmine.createSpyObj('EaselService', [
            'addExchangeCard',
            'removeExchangeCard',
            'isSelectionCard',
            'makeSelection',
            'removeSelection',
            'hasSelection',
            'exchangeHasCard',
            'getSelection',
        ]);
        await TestBed.configureTestingModule({
            declarations: [LetterComponent],
            providers: [{ provide: EaselService, useValue: easelServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        easelServiceSpy.getSelection.and.returnValue(new Observable());
        fixture = TestBed.createComponent(LetterComponent);
        component = fixture.componentInstance;
        component.card = { letter: 'A', point: 9 };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call leftClick of component', () => {
        const spy = spyOn(component, 'handleLeftClick');
        const mockClickEvent = new MouseEvent('click');
        document.getElementById('test')?.dispatchEvent(mockClickEvent);
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it('should call rightClick of component', () => {
        const spy = spyOn(component, 'handleRightClick');
        const mockClickEvent = new MouseEvent('contextmenu');
        document.getElementById('test')?.dispatchEvent(mockClickEvent);
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });
    it('Should return true if card is a selection card', () => {
        easelServiceSpy.isSelectionCard.and.returnValue(true);
        expect(component.isSelectionCard()).toBe(true);
    });
    it('Should return false if card is not a selection card', () => {
        easelServiceSpy.isSelectionCard.and.returnValue(false);
        expect(component.isSelectionCard()).toBe(false);
    });
    it('Should return true if card is a exchange card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(true);
        expect(component.isExchangeCard()).toBe(true);
    });
    it('Should return false if card is not a exchange card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(false);
        expect(component.isExchangeCard()).toBe(false);
    });
    it('handleLeftClick should make the card a selection card', () => {
        component.handleLeftClick();
        expect(easelServiceSpy.makeSelection).toHaveBeenCalled();
    });
    it('handleLeftClick should not call makeSelection when exchange has card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(true);
        component.handleLeftClick();
        expect(easelServiceSpy.makeSelection).not.toHaveBeenCalled();
    });
    it('handleLeftClick should update Border Color', () => {
        const spy = spyOn(component, 'updateBorderColor');
        component.handleLeftClick();
        expect(spy).toHaveBeenCalled();
    });
    it('handLeftClick should remove card from exchange cards', () => {
        component.handleLeftClick();
        expect(easelServiceSpy.removeExchangeCard).toHaveBeenCalled();
    });
    it('handleRightClick should removee exchange card if card is already an exchange Card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(true);
        component.handleRightClick();
        expect(easelServiceSpy.removeExchangeCard).toHaveBeenCalled();
    });
    it('handleRightClick should make card an exchange card if card is not an exchange card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(false);
        component.handleRightClick();
        expect(easelServiceSpy.addExchangeCard).toHaveBeenCalled();
    });
    it('handleRightClick should update Border Color', () => {
        const spy = spyOn(component, 'updateBorderColor');
        component.handleRightClick();
        expect(spy).toHaveBeenCalled();
    });
    it('updateBorderColor should make borderColor red if card is a selection Card', () => {
        easelServiceSpy.isSelectionCard.and.returnValue(true);
        component.updateBorderColor();
        expect(component.borderColor).toBe('#ff9f43');
    });
    it('updateBorderColor should make borderColor blue if card is a exchange Card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(true);
        easelServiceSpy.isSelectionCard.and.returnValue(false);
        component.updateBorderColor();
        expect(component.borderColor).toBe('#341f97');
    });
    it('updateBorderColor should make borderColor black if card is not an exchange Card nor a selection Card', () => {
        easelServiceSpy.exchangeHasCard.and.returnValue(false);
        easelServiceSpy.isSelectionCard.and.returnValue(false);
        component.updateBorderColor();
        expect(component.borderColor).toBe('#047404');
    });
});
