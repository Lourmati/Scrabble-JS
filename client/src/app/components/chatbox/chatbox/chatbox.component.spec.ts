import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Message } from '@app/classes/chatbox/message';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { Observable, Subscriber } from 'rxjs';
import { ChatboxComponent } from './chatbox.component';

import SpyObj = jasmine.SpyObj;

describe('ChatboxComponent', () => {
    let chatboxServiceSpy: SpyObj<ChatboxService>;
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;

    beforeEach(() => {
        chatboxServiceSpy = jasmine.createSpyObj('ChatboxService', {
            getMessages: new Observable<Message>((subscriber: Subscriber<Message>) => {
                subscriber.next({ gameId: 'gameId', playerId: 'server', playerName: 'Server', content: '' });
            }),
        });
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            providers: [{ provide: ChatboxService, useValue: chatboxServiceSpy }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should call getMessages on the service at the initialization', () => {
        expect(chatboxServiceSpy.getMessages).toHaveBeenCalled();
    });

    it('Should add new messages to the messages list', () => {
        expect(component.messages).toHaveSize(1);
    });
});
