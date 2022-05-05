import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { VirtualPlayerNames } from '@app/classes/virtual-player/virtual-player-names';
import { AdminVirtualPlayerDeleteComponent } from '@app/components/admin-page/admin-virtual-player-delete/admin-virtual-player-delete.component';
import { AdminVirtualPlayerEditComponent } from '@app/components/admin-page/admin-virtual-player-edit/admin-virtual-player-edit.component';
import {
    SNACKBAR_DURATION,
    VIRTUAL_PLAYER_ADD_FAILURE,
    VIRTUAL_PLAYER_ADD_SUCCESS,
    VIRTUAL_PLAYER_COLUMNS,
    VIRTUAL_PLAYER_DELETE_FAILURE,
    VIRTUAL_PLAYER_DELETE_SUCCESS,
    VIRTUAL_PLAYER_EDIT_FAILURE,
    VIRTUAL_PLAYER_EDIT_SUCCESS,
    VIRTUAL_PLAYER_NAME_MAX_LENGTH,
    VIRTUAL_PLAYER_NAME_MIN_LENGTH,
    VIRTUAL_PLAYER_RESET_FAILURE,
    VIRTUAL_PLAYER_RESET_SUCCESS,
} from '@app/constants/admin';
import { AdminService } from '@app/services/admin/admin.service';

@Component({
    selector: 'app-admin-virtual-player',
    templateUrl: './admin-virtual-player.component.html',
    styleUrls: ['./admin-virtual-player.component.scss'],
})
export class AdminVirtualPlayerComponent implements OnInit {
    virtualPlayerValueBeginner: number = 0;
    virtualPlayerValueExpert: number = 1;
    virtualPlayerNamesColumns: string[] = VIRTUAL_PLAYER_COLUMNS;
    virtualPlayerNames: VirtualPlayerNames;
    defaultNames: VirtualPlayerNames;
    formGroupBeginner: FormGroup;
    formGroupExpert: FormGroup;

    constructor(private readonly adminService: AdminService, private readonly matDialog: MatDialog, private readonly matSnackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.virtualPlayerNames = { beginner: [], expert: [] };
        this.formGroupBeginner = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(VIRTUAL_PLAYER_NAME_MIN_LENGTH),
                Validators.maxLength(VIRTUAL_PLAYER_NAME_MAX_LENGTH),
            ]),
        });
        this.formGroupExpert = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(VIRTUAL_PLAYER_NAME_MIN_LENGTH),
                Validators.maxLength(VIRTUAL_PLAYER_NAME_MAX_LENGTH),
            ]),
        });
        this.update();
    }

    /**
     * Met à jour la liste des noms des joueurs virtuels
     */
    update(): void {
        this.adminService.getVirtualPlayerNames().subscribe((names: VirtualPlayerNames) => {
            this.virtualPlayerNames = names;
            this.defaultNames = {
                beginner: [names.beginner[0], names.beginner[1], names.beginner[2]],
                expert: [names.expert[0], names.expert[1], names.expert[2]],
            };
        });
    }

    /**
     * Ajoute un nom à la liste de noms
     *
     * @param level Niveau du joueur virtuel
     */
    add(level: VirtualPlayerLevel): void {
        const form = level === VirtualPlayerLevel.BEGINNER ? this.formGroupBeginner : this.formGroupExpert;
        this.adminService.addVirtualPlayerName(form.value.name, level).subscribe((status) => {
            const message = status ? VIRTUAL_PLAYER_ADD_SUCCESS : VIRTUAL_PLAYER_ADD_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: 3000 });
            form.reset();
            this.update();
        });
    }

    /**
     * Modifie un nom dans une liste de noms
     *
     * @param element Nom à modifier
     * @param level Niveau du joueur virtuel
     */
    edit(element: string, level: VirtualPlayerLevel): void {
        const names = level === VirtualPlayerLevel.BEGINNER ? this.virtualPlayerNames.beginner : this.virtualPlayerNames.expert;
        const index = names.indexOf(element);
        const reference = this.matDialog.open(AdminVirtualPlayerEditComponent, {
            data: { name: element },
        });
        reference.afterClosed().subscribe((name: string) => {
            if (name) this.editOnService(index, name, level);
        });
    }

    /**
     * Met à jour la liste de noms dans le service
     *
     * @param index Index du nom à modifier
     * @param name Nouveau nom
     * @param level Niveau du joueur virtuel
     */
    editOnService(index: number, name: string, level: VirtualPlayerLevel): void {
        this.adminService.editVirtualPlayerName(index, name, level).subscribe((status) => {
            const message = status ? VIRTUAL_PLAYER_EDIT_SUCCESS : VIRTUAL_PLAYER_EDIT_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            this.update();
        });
    }

    /**
     * Supprime un nom de la liste de noms
     *
     * @param element Nom à supprimer
     * @param level Niveau du joueur virtuel
     */
    delete(element: string, level: VirtualPlayerLevel): void {
        const names = level === VirtualPlayerLevel.BEGINNER ? this.virtualPlayerNames.beginner : this.virtualPlayerNames.expert;
        const index = names.indexOf(element);
        const reference = this.matDialog.open(AdminVirtualPlayerDeleteComponent);
        reference.afterClosed().subscribe((toDelete: boolean) => {
            if (toDelete) this.deleteOnService(index, level);
        });
    }

    /**
     * Supprime un nom de la liste de noms dans le service
     *
     * @param index Index du nom à supprimer
     * @param level Niveau du joueur virtuel
     */
    deleteOnService(index: number, level: VirtualPlayerLevel): void {
        this.adminService.deleteVirtualPlayerName(index, level).subscribe((status) => {
            const message = status ? VIRTUAL_PLAYER_DELETE_SUCCESS : VIRTUAL_PLAYER_DELETE_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            this.update();
        });
    }

    /**
     * Réinitialise la liste de noms
     */
    reset(): void {
        this.adminService.resetVirtualPlayerName().subscribe((status: boolean) => {
            const message = status ? VIRTUAL_PLAYER_RESET_SUCCESS : VIRTUAL_PLAYER_RESET_FAILURE;
            this.matSnackBar.open(message, 'OK', { duration: SNACKBAR_DURATION });
            if (status) this.update();
        });
    }
}
