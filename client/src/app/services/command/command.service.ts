import { Injectable } from '@angular/core';
import { Letter } from '@app/classes/common/letter';
import { AXIS, Placement } from '@app/classes/grid/placement';
import { Vec2 } from '@app/classes/grid/vec2';
import { A_LETTER_PADDING, COMMAND_EXCHANGE, COMMAND_PLACE, HORIZONTAL, VERTICAL } from '@app/constants/command';
import { ChatboxService } from '@app/services/chatbox/chatbox.service';

@Injectable({
    providedIn: 'root',
})
export class CommandService {
    constructor(private readonly chatboxService: ChatboxService) {}

    /**
     * Joue la commande placer à partir d'un objet placement
     *
     * @param placement Le placement que le client souhaite effectuer
     */
    place(placement: Placement): void {
        const command = this.getPlaceCommand(placement);
        this.chatboxService.emitMessage(command);
    }

    /**
     * Joue la commande échanger
     *
     * @param exchange Les lettres à échanger
     */
    exchange(exchange: Letter[]): void {
        exchange = exchange.map((letter) => ({ letter: letter.letter.toLowerCase(), point: letter.point }));
        const command = this.getExchangeCommand(this.lettersToString(exchange));
        this.chatboxService.emitMessage(command);
    }

    /**
     * Retourne la commande !placer qui correspond à l'objet placement
     *
     * @param placement Le placement à effectuer
     * @returns La commande !placer
     */
    getPlaceCommand(placement: Placement): string {
        return `${COMMAND_PLACE} ${this.vectorToPosition(placement.pos)}${this.directionToOrientation(placement.direction)} ${placement.value}`;
    }

    /**
     * Retourne la commande !échanger qui correspond au paramètre
     *
     * @param exchange Les lettres à échanger
     * @returns La commande !échanger
     */
    getExchangeCommand(exchange: string): string {
        return `${COMMAND_EXCHANGE} ${exchange}`;
    }

    /**
     * Retourne la position sur le plateau qui correspond au vecteur
     *
     * @param position La position (x,y)
     * @returns La position sur le plateau (lettre, chiffre)
     */
    vectorToPosition(position: Vec2): string {
        return String.fromCharCode(position.y + A_LETTER_PADDING) + position.x.toString();
    }

    /**
     * Retourne la lettre associée à une direction
     *
     * @param direction La direction du placement
     * @returns La lettre correspondante à la direction
     */
    directionToOrientation(direction: AXIS): string {
        return direction === AXIS.Horizontal ? HORIZONTAL : VERTICAL;
    }

    /**
     * Retourne les lettres à échangé à partir du tableau des lettres
     *
     * @param exchange Les lettres à échanger
     */
    lettersToString(exchange: Letter[]): string {
        return exchange.map((letter) => letter.letter).join('');
    }
}
