import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    GAME_HISTORY_DELETE_FAILURE,
    GAME_HISTORY_DELETE_SUCCESS,
    GAME_HISTORY_RESET_FAILURE,
    GAME_HISTORY_RESET_SUCCESS,
    SNACKBAR_DURATION,
} from '@app/constants/admin';
import { MOCK_GAME_CLASSIQUE } from '@app/constants/game-history';
import { AdminService } from '@app/services/admin/admin.service';
import { from } from 'rxjs';
import { AdminGameHistoryComponent } from './admin-game-history.component';

describe('AdminGameHistoryComponent', () => {
    let component: AdminGameHistoryComponent;
    let adminServiceStub: jasmine.SpyObj<AdminService>;
    let matSnackBarStub: jasmine.SpyObj<MatSnackBar>;
    let fixture: ComponentFixture<AdminGameHistoryComponent>;

    beforeEach(async () => {
        adminServiceStub = jasmine.createSpyObj(AdminService, ['getGameHistory', 'deleteGameHistory', 'resetGameHistory']);
        adminServiceStub.getGameHistory.and.returnValue(from([]));
        matSnackBarStub = jasmine.createSpyObj(MatSnackBar, ['open']);
        await TestBed.configureTestingModule({
            declarations: [AdminGameHistoryComponent],
            providers: [
                { provide: AdminService, useValue: adminServiceStub },
                { provide: MatSnackBar, useValue: matSnackBarStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminGameHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should update game history', () => {
        adminServiceStub.getGameHistory.and.returnValue(from([[MOCK_GAME_CLASSIQUE]]));
        component.update();
        expect(adminServiceStub.getGameHistory).toHaveBeenCalled();
        expect(component.gameHistory).toEqual([MOCK_GAME_CLASSIQUE]);
    });

    it('Should delete the game history', () => {
        adminServiceStub.deleteGameHistory.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.delete('id');
        expect(matSnackBarStub.open).toHaveBeenCalledWith(GAME_HISTORY_DELETE_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should delete the game history', () => {
        adminServiceStub.deleteGameHistory.and.returnValue(from([false]));
        const spy = spyOn(component, 'update');
        component.delete('id');
        expect(matSnackBarStub.open).toHaveBeenCalledWith(GAME_HISTORY_DELETE_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).not.toHaveBeenCalled();
    });

    it('Should reset the game history', () => {
        adminServiceStub.resetGameHistory.and.returnValue(from([true]));
        const spy = spyOn(component, 'update');
        component.reset();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(GAME_HISTORY_RESET_SUCCESS, 'OK', { duration: SNACKBAR_DURATION });
        expect(spy).toHaveBeenCalled();
    });

    it('Should reset the game history', () => {
        adminServiceStub.resetGameHistory.and.returnValue(from([false]));
        component.reset();
        expect(matSnackBarStub.open).toHaveBeenCalledWith(GAME_HISTORY_RESET_FAILURE, 'OK', { duration: SNACKBAR_DURATION });
    });
});
