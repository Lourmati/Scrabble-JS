import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MESSAGE_DEFAULT_VALUE, MESSAGE_MAX_LENGTH } from '@app/constants/chatbox';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
import { ChatboxInputComponent } from './chatbox-input.component';

import SpyObj = jasmine.SpyObj;

describe('ChatboxInputComponent', () => {
    let chatboxServiceSpy: SpyObj<ChatboxService>;
    let keyboardHandlerSpy: SpyObj<KeyboardHandlerService>;
    let component: ChatboxInputComponent;
    let fixture: ComponentFixture<ChatboxInputComponent>;

    const MESSAGE_VALID = 'Message valide';
    const MESSAGE_INVALID = '#'.repeat(MESSAGE_MAX_LENGTH + 1);

    beforeEach(() => {
        chatboxServiceSpy = jasmine.createSpyObj('ChatboxService', ['emitMessage']);
        keyboardHandlerSpy = jasmine.createSpyObj('KeyboardHandlerService', ['takeControl']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxInputComponent],
            providers: [{ provide: ChatboxService, useValue: chatboxServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxInputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should call emitMessage in the service when pressing enter inside input with valid message', () => {
        const mockPress = new KeyboardEvent('keyup', { key: 'Enter' });
        component.message = MESSAGE_VALID;
        component.handleKeyPressEvent(mockPress);
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalled();
        expect(component.message).toEqual(MESSAGE_DEFAULT_VALUE);
    });

    it('Should not call emitMessage in the service when pressing an other key', () => {
        const mockPress = new KeyboardEvent('keyup', { key: 'A' });
        component.message = MESSAGE_VALID;
        component.handleKeyPressEvent(mockPress);
        expect(chatboxServiceSpy.emitMessage).not.toHaveBeenCalled();
    });

    it('Should not call emitMessage in the service when pressing enter inside input with invalid message', () => {
        const mockPress = new KeyboardEvent('keyup', { key: 'Enter' });
        const resetMessageSpy = spyOn(component, 'resetMessage');
        component.message = MESSAGE_INVALID;
        component.handleKeyPressEvent(mockPress);
        expect(chatboxServiceSpy.emitMessage).not.toHaveBeenCalled();
        expect(resetMessageSpy).not.toHaveBeenCalled();
    });

    it('Should call emitMessage in the service when clicking on send button with valid message', () => {
        const sendButton: HTMLElement = fixture.nativeElement.querySelector('button');
        component.message = MESSAGE_VALID;
        sendButton.click();
        expect(chatboxServiceSpy.emitMessage).toHaveBeenCalled();
        expect(component.message).toEqual(MESSAGE_DEFAULT_VALUE);
    });

    it('Should not call emitMessage in the service when clicking on send button with invalid message', () => {
        const sendButton: HTMLElement = fixture.nativeElement.querySelector('button');
        component.message = MESSAGE_INVALID;
        sendButton.click();
        expect(chatboxServiceSpy.emitMessage).not.toHaveBeenCalled();
    });

    it('Should not call emitMessage in the service when clicking on send button with invalid message', () => {
        const sendButton: HTMLElement = fixture.nativeElement.querySelector('button');
        component.message = '';
        sendButton.click();
        expect(chatboxServiceSpy.emitMessage).not.toHaveBeenCalled();
    });

    it('Should empty the message input when calling resetMessage', () => {
        component.message = MESSAGE_VALID;
        component.resetMessage();
        expect(component.message).toEqual(MESSAGE_DEFAULT_VALUE);
    });
    it('should handleCompoenntClick', () => {
        const div = fixture.debugElement.query(By.css('#message'));
        div.nativeElement.click();
        expect(keyboardHandlerSpy.takeControl).not.toHaveBeenCalled();
    });
});
