import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatboxMessageComponent } from './chatbox-message.component';

describe('ChatboxMessageComponent', () => {
    let component: ChatboxMessageComponent;
    let fixture: ComponentFixture<ChatboxMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxMessageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxMessageComponent);
        component = fixture.componentInstance;
        const mockMessage = { gameId: 'gameId', playerId: 'server', playerName: 'Server', content: '', cssClass: 'by-server' };
        component.message = mockMessage;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should apply CSS class of the message on the author element', () => {
        const authorElement: HTMLElement = fixture.nativeElement.querySelector('.message');
        expect(authorElement.classList).toContain('by-server');
    });
});
