import { Component, Input } from '@angular/core';
import { Message } from '@app/classes/chatbox/message';

@Component({
    selector: 'app-chatbox-message',
    templateUrl: './chatbox-message.component.html',
    styleUrls: ['./chatbox-message.component.scss'],
})
export class ChatboxMessageComponent {
    @Input() message: Message;
}
