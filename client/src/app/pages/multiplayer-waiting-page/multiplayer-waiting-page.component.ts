import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerInformations } from '@app/classes/player/player-informations';
import { MULTIPLAYER_URL, MULTIPLAYER_WAITING_URL, SOLO_URL } from '@app/constants/routing';
import { RoomService } from '@app/services/room/room.service';

@Component({
    selector: 'app-multiplayer-waiting-page',
    templateUrl: './multiplayer-waiting-page.component.html',
    styleUrls: ['./multiplayer-waiting-page.component.scss'],
})
export class MultiplayerWaitingPageComponent implements OnInit {
    guest: PlayerInformations;
    soloRedirection: string;
    backLink: string;

    constructor(private readonly roomService: RoomService, private readonly router: Router) {}

    ngOnInit(): void {
        this.roomService.getJoinRequestHost().subscribe(this.handleJoinRequest.bind(this));
        this.soloRedirection = this.router.url.replace(MULTIPLAYER_WAITING_URL, SOLO_URL);
        this.backLink = this.router.url.replace(MULTIPLAYER_WAITING_URL, MULTIPLAYER_URL);
    }

    handleJoinRequest(guest: PlayerInformations): void {
        this.guest = guest;
    }

    accept() {
        this.roomService.acceptJoinRequest();
    }

    reject() {
        this.guest = undefined as unknown as PlayerInformations;
        this.roomService.rejectJoinRequest();
    }

    cancelRoom() {
        this.roomService.cancelRoom();
    }
}
