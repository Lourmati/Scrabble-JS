import { AfterViewChecked, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Message } from '@app/classes/chatbox/message';

@Component({
    selector: 'app-chatbox-messages',
    templateUrl: './chatbox-messages.component.html',
    styleUrls: ['./chatbox-messages.component.scss'],
})
export class ChatboxMessagesComponent implements AfterViewChecked {
    @Input() messages: Message[];
    @ViewChild('scroll') scroll: ElementRef<HTMLDivElement>;

    /**
     * Scroll vers le bas de la zone de messages lors de la réception d'un nouveau message
     */
    ngAfterViewChecked(): void {
        this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
    }
}
