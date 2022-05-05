import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GameService } from '@app/services/game/game.service';
import { SocketManagerService } from '@app/services/socket-manager/socket-manager.service';
import { SurrenderDialogComponent } from './surrender-dialog.component';

describe('SurrenderDialogComponent', () => {
    let component: SurrenderDialogComponent;
    let fixture: ComponentFixture<SurrenderDialogComponent>;

    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let socketManagerServiceSpy: jasmine.SpyObj<SocketManagerService>;
    let routerSpy: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        gameServiceSpy = jasmine.createSpyObj(GameService, ['getId']);
        socketManagerServiceSpy = jasmine.createSpyObj(SocketManagerService, ['emit']);
        routerSpy = jasmine.createSpyObj(Router, ['navigate']);
        await TestBed.configureTestingModule({
            declarations: [SurrenderDialogComponent],
            providers: [
                { provide: GameService, useValue: gameServiceSpy },
                { provide: SocketManagerService, useValue: socketManagerServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SurrenderDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Should call surrender when clicking on button', () => {
        const surrenderButton: HTMLElement = fixture.nativeElement.querySelector('button');
        const spy = spyOn(component, 'surrender');
        surrenderButton.click();
        expect(spy).toHaveBeenCalled();
    });

    it('Should emit event and redirect to home page', () => {
        gameServiceSpy.getId.and.returnValue('gameId');
        component.surrender();
        expect(gameServiceSpy.getId).toHaveBeenCalled();
        expect(socketManagerServiceSpy.emit).toHaveBeenCalledWith('game:surrender', 'gameId');
        expect(routerSpy.navigate).toHaveBeenCalled();
    });
});
