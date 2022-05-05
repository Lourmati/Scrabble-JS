import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomInformations } from '@app/classes/room/room-informations';
import { RoomRequestStatus } from '@app/classes/room/room-request-status';
import { MESSAGE_ABORTED, MESSAGE_REJECTED, NAME_MAX_LENGTH, NAME_PATTERN } from '@app/constants/create-game';
import { MULTIPLAYER_JOIN_URL, MULTIPLAYER_URL, SOLO_URL } from '@app/constants/routing';
import { GameService } from '@app/services/game/game.service';
import { RoomService } from '@app/services/room/room.service';

@Component({
    selector: 'app-multiplayer-join-page',
    templateUrl: './multiplayer-join-page.component.html',
    styleUrls: ['./multiplayer-join-page.component.scss'],
})
export class MultiplayerJoinPageComponent implements OnInit {
    name: string = '';
    availableRooms: RoomInformations[];
    message: string;
    isSelected: boolean = false;
    isWaiting: boolean = false;
    displayedColumns: string[] = ['name', 'timer', 'dictionary', 'button'];
    nameForm: FormGroup;
    soloRedirection: string;
    backLink: string;
    private selectedRoomId: string;

    constructor(private readonly gameService: GameService, private readonly roomService: RoomService, readonly router: Router) {
        this.soloRedirection = this.router.url.replace(MULTIPLAYER_JOIN_URL, SOLO_URL);
        this.backLink = this.router.url.replace(MULTIPLAYER_JOIN_URL, MULTIPLAYER_URL);
    }

    ngOnInit(): void {
        this.nameForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.maxLength(NAME_MAX_LENGTH), Validators.pattern(NAME_PATTERN)]),
        });
        this.roomService.getAvailableRooms().subscribe(this.handleAvailableRoomsUpdated.bind(this));
        this.roomService.getJoinRequestGuest().subscribe(this.handleStatusUpdated.bind(this));
        this.roomService.updateAvailableRooms();
    }
    hasError = (controlName: string, errorName: string) => {
        // eslint-disable-next-line no-invalid-this
        return this.nameForm.controls[controlName].hasError(errorName);
    };
    selectRoom(roomId: string): void {
        this.isSelected = true;
        this.selectedRoomId = roomId;
    }

    selectRandomRoom(): void {
        this.selectRoom(this.availableRooms[Math.floor(Math.random() * this.availableRooms.length)].id);
    }

    joinRequest(): void {
        this.isWaiting = true;
        this.gameService.setPlayer(this.name);
        this.roomService.joinRequest(this.name, this.selectedRoomId);
    }

    cancelJoinRequest(): void {
        this.isSelected = false;
        this.isWaiting = false;
        this.message = '';
        this.roomService.cancelJoinRequest(this.selectedRoomId);
    }

    handleAvailableRoomsUpdated(availableRoomsUpdated: RoomInformations[]) {
        this.availableRooms = [...availableRoomsUpdated];
    }

    handleStatusUpdated(requestStatus: RoomRequestStatus): void {
        if (requestStatus === RoomRequestStatus.ABORTED) {
            this.message = MESSAGE_ABORTED;
        } else if (requestStatus === RoomRequestStatus.REJECTED) {
            this.message = MESSAGE_REJECTED;
        }
    }
}
