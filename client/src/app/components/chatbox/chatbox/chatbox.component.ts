import { Component, OnInit } from '@angular/core';
import { Message } from '@app/classes/chatbox/message';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    messages: Message[];

    constructor(private readonly chatboxService: ChatboxService) {
        this.messages = [];
    }

    ngOnInit(): void {
        this.handleMessages();
    }

    /**
     * Gère la réception de nouveaux messages
     */
    private handleMessages(): void {
        this.chatboxService.getMessages().subscribe((newMessage: Message) => this.messages.push(newMessage));
    }
}
