import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminVirtualPlayerDeleteComponent } from './admin-virtual-player-delete.component';

describe('AdminVirtualPlayerDeleteComponent', () => {
    let component: AdminVirtualPlayerDeleteComponent;
    let fixture: ComponentFixture<AdminVirtualPlayerDeleteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminVirtualPlayerDeleteComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminVirtualPlayerDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
