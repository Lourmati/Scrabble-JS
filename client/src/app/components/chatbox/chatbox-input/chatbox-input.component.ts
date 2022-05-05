import { Component } from '@angular/core';
import { COMPONENT } from '@app/classes/control/component';
import { INPUT_ENTER_KEY, MESSAGE_DEFAULT_VALUE, MESSAGE_MAX_LENGTH, MESSAGE_MIN_LENGTH } from '@app/constants/chatbox';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';
import { KeyboardHandlerService } from '@app/services/keyboard/keyboard-handler.service';
@Component({
    selector: 'app-chatbox-input',
    templateUrl: './chatbox-input.component.html',
    styleUrls: ['./chatbox-input.component.scss'],
})
export class ChatboxInputComponent {
    message: string;
    messageMinLength: number;
    messageMaxLength: number;

    constructor(private readonly chatboxService: ChatboxService, private readonly keyboardHandlerService: KeyboardHandlerService) {
        this.keyboardHandlerService.getCurrentController().subscribe(this.handleNewController.bind(this));
        this.message = MESSAGE_DEFAULT_VALUE;
        this.messageMinLength = MESSAGE_MIN_LENGTH;
        this.messageMaxLength = MESSAGE_MAX_LENGTH;
    }

    /**
     * Réinitialise le champ de saisie de la boîte de communication
     */
    resetMessage(): void {
        this.message = MESSAGE_DEFAULT_VALUE;
    }
    /**
     * Réinitialise la chatbox si il ya un nouveau composant qui a le controle
     *
     * @param component Nouveau composant qui a le contrôle
     */
    handleNewController(component: COMPONENT) {
        if (component !== COMPONENT.CHATBOX) {
            this.resetMessage();
        }
    }

    /**
     * Gère l'événement de l'appuie sur la touche entrée
     *
     * @param event Évènement de clavier
     */
    handleKeyPressEvent(event: KeyboardEvent): void {
        if (event.key === INPUT_ENTER_KEY) this.emitMessage();
    }
    handleClick(event: MouseEvent) {
        this.keyboardHandlerService.takeControl(COMPONENT.CHATBOX);
        event.stopPropagation();
    }

    /**
     * Envoie le message saisi
     */
    emitMessage(): void {
        if (MESSAGE_MIN_LENGTH <= this.message.length && this.message.length <= MESSAGE_MAX_LENGTH) {
            this.chatboxService.emitMessage(this.message);
            this.resetMessage();
        }
    }
}
