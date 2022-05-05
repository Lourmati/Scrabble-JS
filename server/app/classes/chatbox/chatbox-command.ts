import { Message } from '@app/classes/chatbox/message';

export interface ChatboxCommand {
    filter: RegExp;
    handler: (message: Message) => void;
}
