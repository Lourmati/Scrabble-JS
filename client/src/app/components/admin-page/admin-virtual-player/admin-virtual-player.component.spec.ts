import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VirtualPlayerLevel } from '@app/classes/virtual-player/virtual-player-level';
import { AdminVirtualPlayerEditComponent } from '@app/components/admin-page/admin-virtual-player-edit/admin-virtual-player-edit.component';
import { AdminVirtualPlayerComponent } from '@app/components/admin-page/admin-virtual-player/admin-virtual-player.component';
import {
    VIRTUAL_PLAYER_ADD_FAILURE,
    VIRTUAL_PLAYER_DELETE_FAILURE,
    VIRTUAL_PLAYER_DELETE_SUCCESS,
    VIRTUAL_PLAYER_EDIT_FAILURE,
    VIRTUAL_PLAYER_EDIT_SUCCESS,
    VIRTUAL_PLAYER_RESET_FAILURE,
    VIRTUAL_PLAYER_RESET_SUCCESS,
} from '@app/constants/admin';
import { AdminService } from '@app/services/admin/admin.service';
import { from } from 'rxjs';

const MOCK_NAME = 'name';
const MOCK_NAME_ALT_1 = 'alt_name_1';
const MOCK_NAME_ALT_2 = 'alt_name_2';
const MOCK_NAME_ALT_3 = 'alt_name_3';
const MOCK_NAME_ALT_4 = 'alt_name_4';

describe('AdminVirtualPlayerComponent', () => {
    let component: AdminVirtualPlayerComponent;
    let adminServiceStub: jasmine.SpyObj<AdminService>;
    let matDialogStub: jasmine.SpyObj<MatDialog>;
    let matSnackBarStub: jasmine.SpyObj<MatSnackBar>;
    let matDialogRefStub: jasmine.SpyObj<MatDialogRef<AdminVirtualPlayerEditComponent, unknown>>;

    let fixture: ComponentFixture<AdminVirtualPlayerComponent>;

    beforeEach(async () => {
        adminServiceStub = jasmine.createSpyObj(AdminService, [
            'getVirtualPlayerNames',
            'addVirtualPlayerName',
            'editVirtualPlayerName',
            'deleteVirtualPlayerName',
            'resetVirtualPlayerName',
        ]);
        matDialogStub = jasmine.createSpyObj(MatDialog, ['open']);
        matSnackBarStub = jasmine.createSpyObj(MatSnackBar, ['open']);
        matDialogRefStub = jasmine.createSpyObj(MatDialogRef, ['afterClosed']);

        matDialogStub.open.and.returnValue(matDialogRefStub);
        adminServiceStub.getVirtualPlayerNames.and.returnValue(
            from([
                {
                    beginner: [MOCK_NAME, MOCK_NAME_ALT_1, MOCK_NAME_ALT_2],
                    expert: [MOCK_NAME, MOCK_NAME_ALT_3, MOCK_NAME_ALT_4],
                },
            ]),
        );

        await TestBed.configureTestingModule({
            declarations: [AdminVirtualPlayerComponent],
            providers: [
                { provide: AdminService, useValue: adminServiceStub },
                { provide: MatDialog, useValue: matDialogStub },
                { provide: MatSnackBar, useValue: matSnackBarStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminVirtualPlayerComponent);
        component = fixture.componentInstance;
        component.virtualPlayerNames = {
            beginner: [MOCK_NAME, MOCK_NAME_ALT_1, MOCK_NAME_ALT_2],
            expert: [MOCK_NAME, MOCK_NAME_ALT_3, MOCK_NAME_ALT_4],
        };
        fixture.detectChanges();
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should add a beginner name', () => {
        component.formGroupBeginner.value.name = MOCK_NAME;
        adminServiceStub.addVirtualPlayerName.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.add(VirtualPlayerLevel.BEGINNER);
        expect(adminServiceStub.addVirtualPlayerName).toHaveBeenCalledWith(MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(spy).toHaveBeenCalled();
    });

    it('Should add an expert name', () => {
        component.formGroupExpert.value.name = MOCK_NAME;
        adminServiceStub.addVirtualPlayerName.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.add(VirtualPlayerLevel.EXPERT);
        expect(adminServiceStub.addVirtualPlayerName).toHaveBeenCalledWith(MOCK_NAME, VirtualPlayerLevel.EXPERT);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_ADD_FAILURE, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should edit a beginner name', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([MOCK_NAME_ALT_1]));
        const spy = spyOn(component, 'editOnService');
        component.edit(MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(matDialogStub.open).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(0, MOCK_NAME_ALT_1, VirtualPlayerLevel.BEGINNER);
    });

    it('Should edit an expert name', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([MOCK_NAME_ALT_1]));
        const spy = spyOn(component, 'editOnService');
        component.edit(MOCK_NAME, VirtualPlayerLevel.EXPERT);
        expect(matDialogStub.open).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(0, MOCK_NAME_ALT_1, VirtualPlayerLevel.EXPERT);
    });

    it('Should not edit with empty name', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([undefined]));
        const spy = spyOn(component, 'editOnService');
        component.edit(MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(matDialogStub.open).toHaveBeenCalled();
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should edit on service', () => {
        adminServiceStub.editVirtualPlayerName.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.editOnService(0, MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(adminServiceStub.editVirtualPlayerName).toHaveBeenCalledWith(0, MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_EDIT_SUCCESS, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should edit on service', () => {
        adminServiceStub.editVirtualPlayerName.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.editOnService(0, MOCK_NAME, VirtualPlayerLevel.EXPERT);
        expect(adminServiceStub.editVirtualPlayerName).toHaveBeenCalledWith(0, MOCK_NAME, VirtualPlayerLevel.EXPERT);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_EDIT_FAILURE, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should delete a beginner name', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([true]));
        const spy = spyOn(component, 'deleteOnService');
        component.delete(MOCK_NAME, VirtualPlayerLevel.BEGINNER);
        expect(spy).toHaveBeenCalledWith(0, VirtualPlayerLevel.BEGINNER);
    });

    it('Should delete an expert name', () => {
        matDialogRefStub.afterClosed.and.returnValue(from([false]));
        const spy = spyOn(component, 'deleteOnService');
        component.delete(MOCK_NAME, VirtualPlayerLevel.EXPERT);
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should delete on service', () => {
        adminServiceStub.deleteVirtualPlayerName.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.deleteOnService(0, VirtualPlayerLevel.BEGINNER);
        expect(adminServiceStub.deleteVirtualPlayerName).toHaveBeenCalledWith(0, VirtualPlayerLevel.BEGINNER);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_DELETE_SUCCESS, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should delete on service', () => {
        adminServiceStub.deleteVirtualPlayerName.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.deleteOnService(0, VirtualPlayerLevel.EXPERT);
        expect(adminServiceStub.deleteVirtualPlayerName).toHaveBeenCalledWith(0, VirtualPlayerLevel.EXPERT);
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_DELETE_FAILURE, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should reset on service', () => {
        adminServiceStub.resetVirtualPlayerName.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.reset();
        expect(adminServiceStub.resetVirtualPlayerName).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_RESET_SUCCESS, 'OK', { duration: 3000 });
        expect(spy).toHaveBeenCalled();
    });

    it('Should reset on service', () => {
        adminServiceStub.resetVirtualPlayerName.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.reset();
        expect(adminServiceStub.resetVirtualPlayerName).toHaveBeenCalled();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(VIRTUAL_PLAYER_RESET_FAILURE, 'OK', { duration: 3000 });
        expect(spy).not.toHaveBeenCalled();
    });
});
